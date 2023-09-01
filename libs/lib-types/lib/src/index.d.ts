import { ColorResolvable, GuildMember } from 'discord.js';
export declare enum ChannelLogRecordType {
    BAN = 0,
    UNBAN = 1,
    KICK = 2,
    WARNING = 3,
    UNWARN = 4,
    TEXT = 5,
    SYSTEM = 6,
    TEST = 7
}
export type EmbedField = {
    name: string;
    value: string;
    inline?: boolean;
};
export type ChannelLogRecord = {
    guild: string;
    type: ChannelLogRecordType;
    url?: string;
    description?: string;
    fields?: EmbedField[];
    timestamp?: boolean;
};
export type GuildChannelLogItem = {
    id: number;
    guild_id: string;
    channel_id: string;
    channel_type: ChannelLogRecordType;
};
export type GuildItem = {
    id: number;
    guild_id: string;
    guild_name: string;
    guild_icon: string;
};
export type GuildRssFeedItem = {
    enabled: boolean;
    id: number;
    guild_id: string;
    channel_id: string;
    ping_role_id?: string;
    embed_color?: ColorResolvable;
    embed_image?: string;
    rss_url: string;
    rss_type: string;
};
export type GuildRssPostItem = {
    id: number;
    forum_rss_id: number;
    post_url: string;
    post_content: string;
    post_id: string;
    post_image?: string;
    timestamp: Date;
};
export type GuildRssQueueItem = {
    id: number;
    post_id: number;
    guild_id: string;
};
export type EmbedItem = {
    title: string;
    color: ColorResolvable | null;
    url?: string;
    thumbnail?: string;
    image?: string;
    description?: string;
    fields?: EmbedField[];
    timestamp?: boolean;
};
export type PermissionItem = {
    id: number;
    guild_id: string;
    role_id: string;
    permission: Permission;
};
export type BotGuildItem = GuildItem & {
    permissions?: PermissionItem[];
};
export type BotGuildItemMember = GuildItem & {
    permissions?: PermissionItem[];
    member: GuildMember;
    isOwner?: boolean;
};
export declare enum Permission {
    VIEW_SERVER = 1,
    VIEW_ROLES = 2,
    VIEW_RSS = 3,
    VIEW_CHANNELS = 4,
    VIEW_BANS = 5,
    VIEW_WARNINGS = 6,
    EDIT_ROLES = 102,
    EDIT_RSS = 103,
    EDIT_CHANNELS = 104,
    EDIT_BANS = 105,
    EDIT_WARNINGS = 106
}
export type BotGuild = {
    id: string;
    name: string;
    icon?: string;
    owner: number;
};
//# sourceMappingURL=index.d.ts.map