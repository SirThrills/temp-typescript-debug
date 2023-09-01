import { ColorResolvable } from 'discord.js'

export type GuildRssFeedItem = {
    enabled: boolean
    id: number
    guild_id: string
    channel_id: string
    ping_role_id?: string
    embed_color?: ColorResolvable
    embed_image?: string
    rss_url: string
    rss_type: string
}

export type GuildRssPostItem = {
    id: number
    forum_rss_id: number
    post_url: string
    post_content: string
    post_id: string
    post_image?: string
    timestamp: Date
}

export type GuildRssQueueItem = {
    id: number
    post_id: number
    guild_id: string
}
