export type Headers = {
    authorization?: string
}

export interface Guild {
    guild_id: string,
    guild_name: string,
    guild_icon?: string,
    guild_members: number
}

export type GuildPermission = {
    permission: Permission,
    has: boolean
}

export type GuildRole = {
    id: string,
    name: string
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
    VIEW_WARNINGS
}