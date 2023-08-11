import { GuildRssFeedItem, GuildRssPostItem, GuildRssQueueItem } from "../../types"
import { mysqlClient } from "./client"

export const getGuildRssFeeds = async (guildId: string) => {
    const client = (await mysqlClient()).getConn()
    const [rows, _fields] = await client.query<any[]>('SELECT * FROM `guild_forum_rss_urls` WHERE `guild_id` = ?', [guildId])
    await client.end()
    if (rows == null || rows.length === 0) {
        return
    }
    return rows as GuildRssFeedItem[]
}

export const getGuildRssFeed = async (guildId: string, feedId: number) => {
    const client = (await mysqlClient()).getConn()
    const [rows, _fields] = await client.query<any[]>('SELECT * FROM `guild_forum_rss_urls` WHERE `id` = ? AND `guild_id` = ?', [feedId, guildId])
    await client.end()
    if (rows == null || rows.length !== 1) {
        return
    }
    return rows[0] as GuildRssFeedItem
}

export const getGuildRssFeedLastPost = async (feedId: number) => {
    const client = (await mysqlClient()).getConn()
    const [rows, _fields] = await client.query<any[]>('SELECT * FROM `guild_forum_rss_posts` WHERE `forum_rss_id` = ? ORDER BY `id` DESC LIMIT 1', [feedId])
    await client.end()
    if (rows == null || rows.length !== 1) {
        return
    }
    return rows[0] as GuildRssPostItem
}

export const getGuildRssPost = async (postId: number) => {
    const client = (await mysqlClient()).getConn()
    const [rows, _fields] = await client.query<any[]>('SELECT * FROM `guild_forum_rss_posts` WHERE `id` = ?', [postId])
    await client.end()
    if (rows == null || rows.length !== 1) {
        return
    }
    return rows[0] as GuildRssPostItem
}

export const getGuildRssQueue = async (guildId: string) => {
    const client = (await mysqlClient()).getConn()
    const [rows, _fields] = await client.query<any[]>('SELECT * FROM `guild_forum_rss_post_queue` WHERE `guild_id` = ?', [guildId])
    await client.end()
    if (rows == null || rows.length === 0) {
        return
    }
    return rows as GuildRssQueueItem[]
}

export const addGuildRssPost = async (forumRssId: number, postUrl: string, postId: string, postContent: string | null, pubDate: Date, postImage?: string) => {
    const client = (await mysqlClient()).getConn()
    await client.query<any[]>('INSERT INTO `guild_forum_rss_posts` (`forum_rss_id`, `post_url`, `post_id`, `post_content`, `post_image`, `timestamp`) VALUES (?,?,?,?,?,?)', [forumRssId, postUrl, postId, postContent, postImage, pubDate])
    await client.end()
}

export const addGuildRssPostQueue = async (postId: number, guildId: string) => {
    const client = (await mysqlClient()).getConn()
    await client.query<any[]>('INSERT INTO `guild_forum_rss_post_queue` (`post_id`, `guild_id`) VALUES (?,?)', [postId, guildId])
    await client.end()
}

export const removeGuildRssPostQueueItem = async (queueId: number) => {
    const client = (await mysqlClient()).getConn()
    await client.query<any[]>('DELETE FROM `guild_forum_rss_post_queue` WHERE `id` = ?', [queueId])
    await client.end()
}