import { ChannelType, Client } from "discord.js";
import { Router } from "express";
import { getGuildRolesByPermission, getPermissionsForGuild, getPermissionsForGuildRole } from "../helpers/database/permissions";
import { Permission } from "../types";
import { authMiddleware } from "./middleware";
import { getGuildRssFeeds } from "../helpers/database/rss";

export const guildsRouterHandler = (client: Client) => {
    const guildsRouter = Router()

    guildsRouter.get('/:guildId', authMiddleware(client), async (req, res) => {
        if (res.locals.user == null) {
            return res.sendStatus(403)
        }

        if (req.params.guildId == null || typeof req.params.guildId !== 'string') {
            return res.sendStatus(400)
        }

        const guild = client.guilds.cache.find((guild) => guild.id === req.params.guildId)
        if (guild == null) {
            return res.sendStatus(400)
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
        if (res.locals.user == null) {
            return res.sendStatus(403)
        }

        try {
            const guild = client.guilds.cache.find((guild) => guild.id === req.params.guildId)
            if (guild == null) {
                return res.sendStatus(400)
            }

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

    guildsRouter.get('/:guildId/roles', authMiddleware(client), async (req, res) => {
        if (res.locals.user == null) {
            return res.sendStatus(403)
        }

        const guild = client.guilds.cache.find((guild) => guild.id === req.params.guildId)
        if (guild == null) {
            return res.sendStatus(400)
        }

        const guildViewRolesPermissionRoles = await getGuildRolesByPermission(guild.id, Permission.VIEW_ROLES)
        if (guildViewRolesPermissionRoles == null && guild.ownerId !== res.locals.user.id) {
            return res.sendStatus(403)
        }

        const member = guild.members.cache.find((member) => member.id === res.locals.user.id)
        if (member == null) {
            return res.sendStatus(403)
        }

        if (guild.ownerId !== res.locals.user.id) {
            if (!member.roles.cache.find((role) => {
                return guildViewRolesPermissionRoles?.find((guildRole) => {
                    return role.id === guildRole.role_id
                })
            })) {
                return res.sendStatus(403)
            }
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
        if (res.locals.user == null) {
            return res.sendStatus(403)
        }

        const guild = client.guilds.cache.find((guild) => guild.id === req.params.guildId)
        if (guild == null) {
            return res.sendStatus(400)
        }

        const guildRssFeeds = await getGuildRssFeeds(guild.id)
        if (guildRssFeeds == null || guildRssFeeds.length === 0) {
            return res.sendStatus(204)
        }

        res.send(guildRssFeeds)
    })

    guildsRouter.get('/:guildId/channels', authMiddleware(client), async (req, res) => {
        if (res.locals.user == null) {
            return res.sendStatus(403)
        }

        const guild = client.guilds.cache.find((guild) => guild.id === req.params.guildId)
        if (guild == null) {
            return res.sendStatus(400)
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

    return guildsRouter
}