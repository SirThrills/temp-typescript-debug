import { ChannelType, Client, Guild } from 'discord.js'
import { Router, json } from 'express'
import {
    addGuildRolePermission,
    deleteGuildRolePermission,
    getGuildRolePermission,
    getGuildRolesByPermission,
    getPermissionsForGuild,
    getPermissionsForGuildRole,
} from '../helpers/database/permissions'
import { authMiddleware } from './middleware'
import { getGuildRssFeed, getGuildRssFeeds } from '../helpers/database/rss'
import { userHasPermission } from '../helpers/permission'
import { Permission } from 'lib-types'

export const guildsRouterHandler = (client: Client) => {
    const guildsRouter = Router()

    guildsRouter.use(json())
    guildsRouter.get('/:guildId', authMiddleware(client), async (req, res) => {
        if (
            req.params.guildId == null ||
            typeof req.params.guildId !== 'string'
        ) {
            return res.sendStatus(400)
        }

        const guild = client.guilds.cache.find(
            (guild) => guild.id === req.params.guildId
        )
        if (guild == null) {
            return res.sendStatus(400)
        }

        if (
            !(await userHasPermission(
                client,
                guild,
                res.locals.user,
                Permission.VIEW_SERVER
            ))
        ) {
            return res.sendStatus(403)
        }

        const member = guild.members.cache.find(
            (member) => member.id === res.locals.user.id
        )
        if (member == null) {
            return res.sendStatus(403)
        }

        return res.send({
            guild_id: guild.id,
            guild_name: guild.name,
            guild_icon: guild.iconURL(),
            guild_members: guild.memberCount,
        })
    })

    guildsRouter.get(
        '/:guildId/permissions',
        authMiddleware(client),
        async (req, res) => {
            const guild = client.guilds.cache.find(
                (guild) => guild.id === req.params.guildId
            )
            if (guild == null) {
                return res.sendStatus(400)
            }

            if (
                !(await userHasPermission(
                    client,
                    guild,
                    res.locals.user,
                    Permission.VIEW_SERVER
                ))
            ) {
                return res.sendStatus(403)
            }

            try {
                const member = guild.members.cache.find(
                    (member) => member.id === res.locals.user.id
                )
                if (member == null) {
                    return res.sendStatus(400)
                }

                const guildViewRolesPermissionRoles =
                    await getPermissionsForGuild(guild.id)
                if (
                    guildViewRolesPermissionRoles == null &&
                    guild.ownerId !== res.locals.user.id
                ) {
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

                const mappedPermissions = await Promise.all(
                    permissions.map(async (permission) => {
                        if (guild.ownerId === res.locals.user.id) {
                            return {
                                permission,
                                has: true,
                            }
                        }

                        const guildRolesWithPermission =
                            await getGuildRolesByPermission(
                                guild.id,
                                permission
                            )
                        if (guildRolesWithPermission == null) {
                            return {
                                permission,
                                has: false,
                            }
                        }

                        if (
                            !member.roles.cache.find((role) => {
                                return guildRolesWithPermission.find(
                                    (guildRole) => {
                                        return guildRole.role_id === role.id
                                    }
                                )
                            })
                        ) {
                            return {
                                permission,
                                has: false,
                            }
                        }

                        return {
                            permission,
                            has: false,
                        }
                    })
                )

                // permissions = await permissions.reduce(async (permissionsResult: Promise<number[]>, permission) => {
                //     const permissions = await permissionsResult

                //     const guildRolesWithPermission = await getGuildRolesByPermission(guild.id, permission)
                //     if (guildRolesWithPermission == null) {
                //         return permissions
                //     }

                //     if (!member.roles.cache.find((role) => {
                //         return guildRolesWithPermission.find((guildRole) => {
                //             return guildRole.role_id === role.id
                //         })
                //     })) {
                //         return permissions
                //     }

                //     permissions.push(permission)
                //     return permissions
                // }, Promise.resolve([]))

                return res.send(mappedPermissions)
            } catch (err) {
                console.log(err)
                return res.sendStatus(500)
            }
        }
    )

    guildsRouter.get(
        '/:guildId/roles/permissions',
        authMiddleware(client),
        async (req, res) => {
            const guild = client.guilds.cache.find(
                (guild) => guild.id === req.params.guildId
            )
            if (guild == null) {
                return res.sendStatus(400)
            }

            if (
                !(await userHasPermission(
                    client,
                    guild,
                    res.locals.user,
                    Permission.VIEW_ROLES
                ))
            ) {
                return res.sendStatus(403)
            }

            const member = guild.members.cache.find(
                (member) => member.id === res.locals.user.id
            )
            if (member == null) {
                return res.sendStatus(403)
            }

            const mappedRoles = await Promise.all(
                guild.roles.cache.map(async (role) => {
                    const permissions = await getPermissionsForGuildRole(
                        guild.id,
                        role.id
                    )
                    return {
                        id: role.id,
                        name: role.name,
                        permissions: permissions?.map((permission) => {
                            return permission.permission
                        }),
                    }
                })
            )

            res.send(mappedRoles)
        }
    )

    guildsRouter.get(
        '/:guildId/roles/:roleId/permissions',
        authMiddleware(client),
        async (req, res) => {
            const guild = client.guilds.cache.find(
                (guild) => guild.id === req.params.guildId
            )
            if (guild == null) {
                return res.sendStatus(400)
            }

            if (
                req.params.roleId == null ||
                typeof req.params.roleId !== 'string'
            ) {
                return res.sendStatus(400)
            }

            if (
                !(await userHasPermission(
                    client,
                    guild,
                    res.locals.user,
                    Permission.VIEW_ROLES
                ))
            ) {
                return res.sendStatus(403)
            }

            const member = guild.members.cache.find(
                (member) => member.id === res.locals.user.id
            )
            if (member == null) {
                return res.sendStatus(403)
            }

            if (
                guild.roles.cache.find(
                    (role) => role.id === req.params.roleId
                ) == null
            ) {
                return res.sendStatus(400)
            }

            const permissions = await getPermissionsForGuildRole(
                guild.id,
                req.params.roleId
            )

            let allPermissions: number[] = []
            for (const permissionString in Permission) {
                const permission = parseInt(permissionString)
                if (isNaN(permission)) {
                    continue
                }
                allPermissions.push(permission)
            }

            const mappedPermissions = allPermissions.map((permission) => {
                if (
                    permissions?.find(
                        (rolePermission) =>
                            rolePermission.permission === permission
                    )
                ) {
                    return {
                        permission: permission,
                        has: true,
                    }
                }

                return {
                    permission: permission,
                    has: false,
                }
            })

            res.send(mappedPermissions)
        }
    )

    guildsRouter.post(
        '/:guildId/roles/:roleId/permissions',
        authMiddleware(client),
        async (req, res) => {
            const guild = client.guilds.cache.find(
                (guild) => guild.id === req.params.guildId
            )
            if (guild == null) {
                return res.status(400).send({ error: 'invalid_guild' })
            }

            const role = guild.roles.cache.find(
                (role) => role.id === req.params.roleId
            )

            if (role == null) {
                return res.status(400).send({ error: 'invalid_role' })
            }

            try {
                if (
                    !(await userHasPermission(
                        client,
                        guild,
                        res.locals.user,
                        Permission.EDIT_ROLES
                    ))
                ) {
                    return res.sendStatus(403)
                }

                const member = guild.members.cache.find(
                    (member) => member.id === res.locals.user.id
                )
                if (member == null) {
                    return res.sendStatus(403)
                }

                if (
                    req.body == null ||
                    req.body.permission == null ||
                    req.body.value == null
                ) {
                    return res.status(400).send({ error: 'invalid_body' })
                }

                const permission = req.body.permission
                const value = req.body.value

                if (
                    typeof permission !== 'number' ||
                    typeof value !== 'boolean'
                ) {
                    return res.status(400).send({ error: 'invalid_type' })
                }

                let allPermissions: number[] = []
                for (const permissionString in Permission) {
                    const permission = parseInt(permissionString)
                    if (isNaN(permission)) {
                        continue
                    }
                    allPermissions.push(permission)
                }

                if (
                    allPermissions.find(
                        (allPermission) => allPermission === permission
                    ) == null
                ) {
                    return res.status(400).send({ error: 'invalid_permission' })
                }

                const currentValue = await getGuildRolePermission(
                    guild.id,
                    role.id,
                    permission
                )
                if (
                    (currentValue && value) ||
                    (currentValue == null && !value)
                ) {
                    return res.sendStatus(200)
                }

                if (value) {
                    await addGuildRolePermission(guild.id, role.id, permission)
                } else {
                    await deleteGuildRolePermission(
                        guild.id,
                        role.id,
                        permission
                    )
                }

                return res.sendStatus(200)
            } catch (err) {
                console.log(err)
            }

            return res.sendStatus(500)
        }
    )

    guildsRouter.get(
        '/:guildId/rss/feeds',
        authMiddleware(client),
        async (req, res) => {
            const guild = client.guilds.cache.find(
                (guild) => guild.id === req.params.guildId
            )
            if (guild == null) {
                return res.sendStatus(400)
            }

            if (
                !(await userHasPermission(
                    client,
                    guild,
                    res.locals.user,
                    Permission.VIEW_RSS
                ))
            ) {
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
                    ...(guild.channels.cache.size > 0 && {
                        channel_name: guild.channels.cache.find(
                            (channel) => channel.id === feed.channel_id
                        )?.name,
                    }),
                    ...(guild.roles.cache.size > 0 &&
                        feed.ping_role_id && {
                            role_name: guild.roles.cache.find(
                                (role) => role.id === feed.ping_role_id
                            )?.name,
                        }),
                }
            })

            res.send(mappedFeeds)
        }
    )

    guildsRouter.get(
        '/:guildId/rss/feed/:feedId',
        authMiddleware(client),
        async (req, res) => {
            const guild = client.guilds.cache.find(
                (guild) => guild.id === req.params.guildId
            )
            if (guild == null) {
                return res.status(400).send({ error: 'invalid_guild' })
            }

            if (
                !(await userHasPermission(
                    client,
                    guild,
                    res.locals.user,
                    Permission.VIEW_RSS
                ))
            ) {
                return res.sendStatus(403)
            }

            if (
                req.params.feedId == null ||
                isNaN(parseInt(req.params.feedId))
            ) {
                return res.status(400).send({ error: 'invalid_feed' })
            }

            const feed = await getGuildRssFeed(
                guild.id,
                parseInt(req.params.feedId)
            )
            if (feed == null) {
                return res.sendStatus(404)
            }

            const mappedFeed = {
                ...feed,
                guild_name: guild.name,
                ...(guild.channels.cache.size > 0 && {
                    channel_name: guild.channels.cache.find(
                        (channel) => channel.id === feed.channel_id
                    )?.name,
                }),
                ...(guild.roles.cache.size > 0 &&
                    feed.ping_role_id && {
                        role_name: guild.roles.cache.find(
                            (role) => role.id === feed.ping_role_id
                        )?.name,
                    }),
            }

            res.send(mappedFeed)
        }
    )

    guildsRouter.get(
        '/:guildId/channels',
        authMiddleware(client),
        async (req, res) => {
            const guild = client.guilds.cache.find(
                (guild) => guild.id === req.params.guildId
            )
            if (guild == null) {
                return res.sendStatus(400)
            }

            if (
                !(await userHasPermission(
                    client,
                    guild,
                    res.locals.user,
                    Permission.VIEW_CHANNELS
                ))
            ) {
                return res.sendStatus(403)
            }

            const guildChannels = guild.channels.cache
                .filter((channel) => channel.type === ChannelType.GuildText)
                .map((channel) => {
                    return {
                        id: channel.id,
                        name: channel.name,
                    }
                })
            if (guildChannels.length === 0) {
                return res.sendStatus(204)
            }

            res.send(guildChannels)
        }
    )

    guildsRouter.get(
        '/:guildId/roles',
        authMiddleware(client),
        async (req, res) => {
            const guild = client.guilds.cache.find(
                (guild) => guild.id === req.params.guildId
            )
            if (guild == null) {
                return res.sendStatus(400)
            }

            if (
                !(await userHasPermission(
                    client,
                    guild,
                    res.locals.user,
                    Permission.VIEW_ROLES
                ))
            ) {
                return res.sendStatus(403)
            }

            const guildRoles = guild.roles.cache.map((role) => {
                return {
                    id: role.id,
                    name: role.name,
                }
            })

            if (guildRoles.length === 0) {
                return res.sendStatus(204)
            }

            res.send(guildRoles)
        }
    )

    return guildsRouter
}
