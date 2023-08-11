import Parser from "rss-parser";
import { GuildRssFeedItem, GuildRssPostItem } from "../types";
import { ChannelType, Client, Guild } from "discord.js";
import { createEmbed } from "./embed";
import { addGuildRssPost, getGuildRssFeedLastPost, addGuildRssPostQueue, getGuildRssQueue, getGuildRssPost, removeGuildRssPostQueueItem, getGuildRssFeed } from "./database/rss";
//import parse from "node-html-parser";

const parser = new Parser({
    customFields: {
        item: ['slash:comments']
    }
})

const stripTags = (str: string) => {
    //return parse(str).toString()
    // return str
    //     .replace(/(<(br[^>]*)>)/ig, '\n')
    //     .replace(/(<([^>]+)>)/ig, '')
    //     .replace(/\n+/g, "\n")
    // Return a blank string for now until we figure out a better method of parsing a varying array of forum post tags
    return 'N/A'
}

export const processRssItem = async (item: {
    [key: string]: any;
} & Parser.Item, feed: GuildRssFeedItem, guild: Guild, lastPost?: GuildRssPostItem) => {
    if (!item.pubDate || !item.link || !item.title) {
        return
    }
    const postDate = new Date(item.pubDate)
    if (postDate == null) {
        return
    }
    if (lastPost != null && lastPost.timestamp >= postDate) {
        return
    }

    const comments = item['slash:comments'] as number | undefined
    const content = item['content:encoded'] as string | undefined

    let imageUrl
    // Inconsistent images - disabled for now (investigate uploading a fixed image size to s3 instead)
    // let imageMatch = content?.match(/https:\/\/board-([A-Za-z0-9]+(\.[A-Za-z0-9]+)+)\/[A-Za-z]+\/[0-9]+\//i)
    // if (imageMatch) {
    //     imageUrl = imageMatch[0]
    // }
    //console.log('imageUrl', imageUrl)

    let contentString = null
    if (comments == null && content) {
        contentString = stripTags(content)
    }
    console.log('adding post', item.title)
    await addGuildRssPost(feed.id, item.link, item.title, contentString, postDate, imageUrl)
    const post = await getGuildRssFeedLastPost(feed.id)
    if (post == null) {
        return
    }
    await addGuildRssPostQueue(post.id, guild.id)
}

export const processGuildRssFeed = async (guild: Guild, feeds: GuildRssFeedItem[]) => {
    feeds.forEach(async (feed) => {
        try {
            const promises = Promise.all([getGuildRssFeedLastPost(feed.id), parser.parseURL(feed.rss_url)])
            const [lastPost, rssFeed] = await promises
            if (rssFeed.items == null || rssFeed.items.length === 0) {
                return
            }

            if (lastPost == null) {
                console.log('no lastpost for feed id', feed.id)
                return await processRssItem(rssFeed.items[0], feed, guild, lastPost)
            }
            rssFeed.items.reverse().forEach(async (item) => {
                await processRssItem(item, feed, guild, lastPost)
            })
        } catch (err) {
            console.log(err)
        }
    })
}

export const processGuildRssQueue = async (client: Client, guild: Guild) => {
    const postQueue = await getGuildRssQueue(guild.id)
    if (postQueue == null) {
        return
    }

    postQueue.forEach(async (postQueueItem) => {
        try {
            console.log('processing rss queue item', postQueueItem.id)
            const post = await getGuildRssPost(postQueueItem.post_id)
            if (post == null) {
                return
            }
            await removeGuildRssPostQueueItem(postQueueItem.id)
            const rssFeedInfo = await getGuildRssFeed(guild.id, post.forum_rss_id)
            if (rssFeedInfo == null) {
                return
            }

            const channel = client.channels.cache.find((channel) => channel.id === rssFeedInfo.channel_id)
            if (channel == null || channel.type !== ChannelType.GuildText) {
                return
            }

            const fields = [{ name: post.post_content ? 'New Forum Thread' : 'New Forum Post', value: post.post_content ? 'A new thread has been created' : 'A new post has been added to the the thread.' }, { name: 'Link', value: post.post_url }]
            const embed = createEmbed({ title: post.post_id, color: rssFeedInfo.embed_color ?? null, url: post.post_url, thumbnail: rssFeedInfo.embed_image, image: post.post_image, fields, timestamp: true })
            let content
            if (rssFeedInfo.ping_role_id) {
                content = `<@&${rssFeedInfo.ping_role_id}>`
            }
            await channel.send({ content, embeds: [embed] })
        } catch (err) {
            console.log(err)
        }
    })
}
