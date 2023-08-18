import { ChannelType, Client, Guild } from "discord.js";
import { Router } from "express";
import { getGuildRolesByPermission, getPermissionsForGuild, getPermissionsForGuildRole } from "../helpers/database/permissions";
import { Permission } from "../types";
import { authMiddleware } from "./middleware";
import { getGuildRssFeed, getGuildRssFeeds } from "../helpers/database/rss";
import { userHasPermission } from "../helpers/permission";

export const guildsRouterHandler = (client: Client) => {
    const guildsRouter = Router()

    guildsRouter.get('/:guildId', authMiddleware(client), async (req, res) => {
        if (req.params.guildId == null || typeof req.params.guildId !== 'string') {
            return res.sendStatus(400)
        }

        const guild = client.guilds.cache.find((guild) => guild.id === req.params.guildId)
        if (guild == null) {
            return res.sendStatus(400)
        }

        if (!await userHasPermission(client, guild, res.locals.user, Permission.VIEW_SERVER)) {
            return res.sendStatus(403)
        }

        const member = guild.members.cache.find((member) => member.id === res.locals.user.id)
        if (member == null) {
            return res.sendStatus(403)
        }

        return res.send({
            guild_id: guild.id,
            guild_name: guild.name,
            guild_icon: guild.iconURL(),
            guild_members: guild.memberCount
        })
    })

    guildsRouter.get('/:guildId/permissions', authMiddleware(client), async (req, res) => {
        const guild = client.guilds.cache.find((guild) => guild.id === req.params.guildId)
        if (guild == null) {
            return res.sendStatus(400)
        }

        if (!await userHasPermission(client, guild, res.locals.user, Permission.VIEW_SERVER)) {
            return res.sendStatus(403)
        }

        try {

            const member = guild.members.cache.find((member) => member.id === res.locals.user.id)
            if (member == null) {
                return res.sendStatus(400)
            }

            const guildViewRolesPermissionRoles = await getPermissionsForGuild(guild.id)
            if (guildViewRolesPermissionRoles == null && guild.ownerId !== res.locals.user.id) {
                return res.sendStatus(403)
            }

            let permissions: number[] = []
            for (const permissionString in Permission) {
                const permission = parseInt(permissionString)
                if (isNaN(permission)) {
                    continue
                }
                permissions.push(permission)
            }

            permissions = await permissions.reduce(async (permissionsResult: Promise<number[]>, permission) => {
                const permissions = await permissionsResult

                if (guild.ownerId === res.locals.user.id) {
                    permissions.push(permission)
                    return permissions
                }

                const guildRolesWithPermission = await getGuildRolesByPermission(guild.id, permission)
                if (guildRolesWithPermission == null) {
                    return permissions
                }

                if (!member.roles.cache.find((role) => {
                    return guildRolesWithPermission.find((guildRole) => {
                        return guildRole.role_id === role.id
                    })
                })) {
                    return permissions
                }

                permissions.push(permission)
                return permissions
            }, Promise.resolve([]))

            return res.send(permissions)
        } catch (err) {
            console.log(err)
            return res.sendStatus(500)
        }
    })

    guildsRouter.get('/:guildId/roles/permissions', authMiddleware(client), async (req, res) => {
        const guild = client.guilds.cache.find((guild) => guild.id === req.params.guildId)
        if (guild == null) {
            return res.sendStatus(400)
        }

        if (!await userHasPermission(client, guild, res.locals.user, Permission.VIEW_ROLES)) {
            return res.sendStatus(403)
        }

        const member = guild.members.cache.find((member) => member.id === res.locals.user.id)
        if (member == null) {
            return res.sendStatus(403)
        }

        const mappedRoles = await Promise.all(guild.roles.cache.map(async (role) => {
            const permissions = await getPermissionsForGuildRole(guild.id, role.id)
            return {
                id: role.id,
                name: role.name,
                permissions: permissions?.map((permission) => {
                    return permission.permission
                })
            }
        }))

        res.send(mappedRoles)
    })

    guildsRouter.get('/:guildId/rss/feeds', authMiddleware(client), async (req, res) => {
        const guild = client.guilds.cache.find((guild) => guild.id === req.params.guildId)
        if (guild == null) {
            return res.sendStatus(400)
        }

        if (!await userHasPermission(client, guild, res.locals.user, Permission.VIEW_RSS)) {
            return res.sendStatus(403)
        }

        const guildRssFeeds = await getGuildRssFeeds(guild.id)
        if (guildRssFeeds == null || guildRssFeeds.length === 0) {
            return res.sendStatus(204)
        }

        const mappedFeeds = guildRssFeeds.map((feed) => {
            return {
                ...feed,
                guild_name: guild.name,
                ...guild.channels.cache.size > 0 && {
                    channel_name: guild.channels.cache.find(channel => channel.id === feed.channel_id)?.name
                },
                ...guild.roles.cache.size > 0 && feed.ping_role_id && {
                    role_name: guild.roles.cache.find(role => role.id === feed.ping_role_id)?.name
                }
            }
        })

        res.send(mappedFeeds)
    })

    guildsRouter.get('/:guildId/rss/feed/:feedId', authMiddleware(client), async (req, res) => {
        const guild = client.guilds.cache.find((guild) => guild.id === req.params.guildId)
        if (guild == null) {
            return res.status(400).send({ error: 'invalid_guild' })
        }

        if (!await userHasPermission(client, guild, res.locals.user, Permission.VIEW_RSS)) {
            return res.sendStatus(403)
        }

        if (req.params.feedId == null || isNaN(parseInt(req.params.feedId))) {
            return res.status(400).send({ error: 'invalid_feed' })
        }

        const feed = await getGuildRssFeed(guild.id, parseInt(req.params.feedId))
        if (feed == null) {
            return res.sendStatus(404)
        }

        const mappedFeed = {
            ...feed,
            guild_name: guild.name,
            ...guild.channels.cache.size > 0 && {
                channel_name: guild.channels.cache.find(channel => channel.id === feed.channel_id)?.name
            },
            ...guild.roles.cache.size > 0 && feed.ping_role_id && {
                role_name: guild.roles.cache.find(role => role.id === feed.ping_role_id)?.name
            }

        }

        res.send(mappedFeed)
    })

    guildsRouter.get('/:guildId/channels', authMiddleware(client), async (req, res) => {
        const guild = client.guilds.cache.find((guild) => guild.id === req.params.guildId)
        if (guild == null) {
            return res.sendStatus(400)
        }

        if (!await userHasPermission(client, guild, res.locals.user, Permission.VIEW_CHANNELS)) {
            return res.sendStatus(403)
        }

        const guildChannels = guild.channels.cache.filter(channel => channel.type === ChannelType.GuildText).map((channel) => {
            return {
                id: channel.id,
                name: channel.name
            }
        })
        if (guildChannels.length === 0) {
            return res.sendStatus(204)
        }

        res.send(guildChannels)
    })

    guildsRouter.get('/:guildId/roles', authMiddleware(client), async (req, res) => {
        const guild = client.guilds.cache.find((guild) => guild.id === req.params.guildId)
        if (guild == null) {
            return res.sendStatus(400)
        }

        if (!await userHasPermission(client, guild, res.locals.user, Permission.VIEW_ROLES)) {
            return res.sendStatus(403)
        }

        const guildRoles = guild.roles.cache.map((role) => {
            return {
                id: role.id,
                name: role.name
            }
        })

        if (guildRoles.length === 0) {
            return res.sendStatus(204)
        }

        res.send(guildRoles)
    })

    return guildsRouter
}
