import Parser from "rss-parser";
import { GuildRssFeedItem, GuildRssPostItem } from "../types";
import { ChannelType, Client, Guild } from "discord.js";
import { addGuildRssPost, addGuildRssPostQueue, getGuildRssFeed, getGuildRssFeedLastPost, getGuildRssPost, getGuildRssQueue, removeGuildRssPostQueueItem } from "./database/guild";
import { createEmbed } from "./embed";
import parse from "node-html-parser";

const parser = new Parser({
    customFields: {
        item: ['slash:comments']
    }
})

const stripTags = (str: string) => {
    return parse(str).toString()
    /*return str
        .replace(/(<(br[^>]*)>)/ig, '\n')
        .replace(/(<([^>]+)>)/ig, '')
        .replace(/\n+/g, "\n")*/
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
    //console.log(lastPost?.timestamp, postDate, lastPost && lastPost?.timestamp >= postDate ? 'true' : 'false')
    if (lastPost != null && lastPost.timestamp >= postDate) {
        return
    }

    console.log('item', item)
    const comments = item['slash:comments'] as number | undefined
    console.log(item.title, 'comments:', comments)
    const content = item['content:encoded'] as string | undefined

    let imageUrl
    // Inconsistent images
    // let imageMatch = content?.match(/https:\/\/board-([A-Za-z0-9]+(\.[A-Za-z0-9]+)+)\/[A-Za-z]+\/[0-9]+\//i)
    // if (imageMatch) {
    //     imageUrl = imageMatch[0]
    // }

    console.log('imageUrl', imageUrl)

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
        console.log('processing feed id', feed.id)
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
    })
}

export const processGuildRssQueue = async (client: Client, guild: Guild) => {
    const postQueue = await getGuildRssQueue(guild.id)
    if (postQueue == null) {
        return
    }

    postQueue.forEach(async (postQueueItem) => {
        console.log('processing rss queue item', postQueueItem.id)
        const post = await getGuildRssPost(postQueueItem.post_id)
        if (post == null) {
            return
        }
        await removeGuildRssPostQueueItem(postQueueItem.id)
        const rssFeedInfo = await getGuildRssFeed(post.forum_rss_id)
        if (rssFeedInfo == null) {
            return
        }

        const channel = client.channels.cache.find((channel) => channel.id === rssFeedInfo.channel_id)
        if (channel == null || channel.type !== ChannelType.GuildText) {
            return
        }

        const fields = [{ name: 'Post Info', value: post.post_content ?? 'A new post has been added to the the thread.' }, { name: 'Link', value: post.post_url }]
        const embed = createEmbed({ title: post.post_id, color: rssFeedInfo.embed_color ?? null, url: post.post_url, thumbnail: rssFeedInfo.embed_image, image: post.post_image, fields, timestamp: true })
        await channel.send({ embeds: [embed] })
    })
}
