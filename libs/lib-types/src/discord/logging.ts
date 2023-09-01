import { ColorResolvable } from 'discord.js'

export enum ChannelLogRecordType {
    BAN,
    UNBAN,
    KICK,
    WARNING,
    UNWARN,
    TEXT,
    SYSTEM,
    TEST,
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
