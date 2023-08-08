import { Client, Guild } from "discord.js";
import { mysqlClient } from "./client";
import { ChannelLogRecordType, GuildItem, GuildRssFeedItem, GuildRssPostItem, GuildRssQueueItem } from "../../types";
import { addChannelLogRecord } from "../channelLogging";

export const updateActiveGuilds = async (client: Client) => {
    const guilds = client.guilds.cache
    const dbGuilds = await getDatabaseGuilds()
    for (const guild of guilds) {
        if (dbGuilds && dbGuilds.find((dbGuild) => dbGuild.guild_id === guild[1].id)) {
            console.log('Updating guild', guild[1].id)
            await updateGuild(guild[1])
            await addChannelLogRecord(client, { guild: guild[1].id, type: ChannelLogRecordType.SYSTEM, fields: [{ name: 'Guild Metadata Updated', value: 'Database metadata updated for this guild' }] })
            continue
        }
        console.log('Adding guild:', guild[1].id)
        await addGuild(guild[1])
    }

    if (!dbGuilds) {
        return
    }
    for (const dbGuild of dbGuilds) {
        if (guilds.find((guild) => guild.id === dbGuild.guild_id)) {
            continue
        }
        console.log('Removing guild:', dbGuild.guild_id)
        await removeGuild(dbGuild.guild_id)
    }
}

export const getDatabaseGuilds = async () => {
    const client = (await mysqlClient()).getConn()
    const [rows, _fields] = await client.query<any[]>('SELECT * FROM `guilds`')
    await client.end()
    if (rows == null || rows.length === 0) {
        return
    }
    return rows as GuildItem[]
}

export const getGuildRssFeeds = async (guildId: string) => {
    const client = (await mysqlClient()).getConn()
    const [rows, _fields] = await client.query<any[]>('SELECT * FROM `guild_forum_rss_urls` WHERE `guild_id` = ?', [guildId])
    await client.end()
    if (rows == null || rows.length === 0) {
        return
    }
    return rows as GuildRssFeedItem[]
}

export const getGuildRssFeed = async (feedId: number) => {
    const client = (await mysqlClient()).getConn()
    const [rows, _fields] = await client.query<any[]>('SELECT * FROM `guild_forum_rss_urls` WHERE `id` = ?', [feedId])
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

export const addGuild = async (guild: Guild) => {
    const client = (await mysqlClient()).getConn()
    await client.query<any[]>('INSERT INTO `guilds` (`guild_id`, `guild_name`, `guild_icon`) VALUES (?,?,?)', [guild.id, guild.name, guild.iconURL()])
    await client.end()
}

export const updateGuild = async (guild: Guild) => {
    const client = (await mysqlClient()).getConn()
    await client.query<any[]>('UPDATE `guilds` SET `guild_name` = ?, `guild_icon` = ? WHERE `guild_id` = ?', [guild.name, guild.iconURL(), guild.id])
    await client.end()
}

export const removeGuild = async (guildId: string) => {
    const client = (await mysqlClient()).getConn()
    await client.query<any[]>('DELETE FROM `guilds` WHERE `guild_id` = ?', [guildId])
    await client.end()
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