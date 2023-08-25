export type Headers = {
    authorization?: string
}

export interface Guild {
    guild_id: string
    guild_name: string
    guild_icon?: string
    guild_members: number
}

export type GuildPermission = {
    permission: Permission
    has: boolean
}

export type GuildRole = {
    id: string
    name: string
}

export type GuildChannel = {
    id: string
    name: string
}

export type GuildRSS = {
    id: number
    name: string
    role_name?: string | undefined
    channel_name?: string | undefined
    guild_name: string
    enabled: boolean
    guild_id: string
    channel_id: string
    ping_role_id?: string | undefined
    embed_color?: string | undefined
    embed_image?: string | undefined
    rss_url: string
    rss_type: string
}

export type Me = {
    id: string
    username: string
    globalName: string | null
    avatarURL?: string
}

export enum Permission {
    VIEW_SERVER = 1,
    VIEW_ROLES,
    VIEW_RSS,
    VIEW_CHANNELS,
    VIEW_BANS,
    VIEW_WARNINGS,

    EDIT_ROLES = 102,
    EDIT_RSS = 103,
    EDIT_CHANNELS = 104,
    EDIT_BANS = 105,
    EDIT_WARNINGS = 106,
}
