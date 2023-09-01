import { GuildMember } from 'discord.js'

export type GuildItem = {
    id: number
    guild_id: string
    guild_name: string
    guild_icon: string
}

export type PermissionItem = {
    id: number
    guild_id: string
    role_id: string
    permission: Permission
}

export type BotGuildItem = GuildItem & {
    permissions?: PermissionItem[]
}

export type BotGuildItemMember = GuildItem & {
    permissions?: PermissionItem[]
    member: GuildMember
    isOwner?: boolean
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

export type BotGuild = {
    id: string
    name: string
    icon?: string
    owner: number
}
