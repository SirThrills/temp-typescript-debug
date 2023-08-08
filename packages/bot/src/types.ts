import { ColorResolvable } from "discord.js"

export enum ChannelLogRecordType {
    BAN,
    UNBAN,
    KICK,
    WARNING,
    UNWARN,
    TEXT,
    SYSTEM,
    TEST
}

export type EmbedField = {
    name: string
    value: string
    inline?: boolean
}

export type ChannelLogRecord = {
    guild: string
    type: ChannelLogRecordType
    url?: string
    description?: string
    fields?: EmbedField[]
    timestamp?: boolean
}

export type GuildChannelLogItem = {
    id: number
    guild_id: string
    channel_id: string
    channel_type: ChannelLogRecordType
}

export type GuildItem = {
    id: number
    guild_id: string
    guild_name: string
    guild_icon: string
}

export type GuildRssFeedItem = {
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

export type EmbedItem = {
    title: string
    color: ColorResolvable | null
    url?: string
    thumbnail?: string
    image?: string
    description?: string
    fields?: EmbedField[]
    timestamp?: boolean
}