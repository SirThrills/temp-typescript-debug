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

export type ChannelLogRecordField = {
    name: string
    value: string
    inline?: boolean
}

export type ChannelLogRecord = {
    guild: string
    type: ChannelLogRecordType
    url?: string
    description?: string
    fields?: ChannelLogRecordField[]
    timestamp?: boolean
}

export type GuildChannelLogModel = {
    id: number
    guild_id: string
    channel_id: string
    channel_type: ChannelLogRecordType
}

export type GuildModel = {
    id: number
    guild_id: string
    guild_name: string
    guild_icon: string
}