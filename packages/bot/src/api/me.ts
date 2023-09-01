import { Client } from 'discord.js'
import { Router } from 'express'
import { authMiddleware } from './middleware'
import { deleteWebSession } from '../helpers/database/api'
import { getDatabaseGuilds } from '../helpers/database/guild'
import { getPermissionsForGuild } from '../helpers/database/permissions'
import { BotGuildItemMember, Permission } from 'lib-types'

export const meRouterHandler = (client: Client) => {
    const meRouter = Router()

    meRouter.post('/logout', authMiddleware(client), async (req, res) => {
        try {
            await deleteWebSession(res.locals.jwt_access_token)
            return res.sendStatus(200)
        } catch (err) {
            console.log(err)
        }
        return res.sendStatus(500)
    })

    meRouter.get('/info', authMiddleware(client), async (req, res) => {
        const user = client.users.cache.find(
            (user) => user.id === res.locals.user.id
        )
        if (user == null) {
            return res.sendStatus(204)
        }

        res.send(user)
    })

    meRouter.get('/guilds', authMiddleware(client), async (_req, res) => {
        try {
            const guilds = await getDatabaseGuilds()
            if (guilds == null || guilds.length === 0) {
                console.log('hello1')
                return res.sendStatus(204)
            }
            const mappedGuilds = await Promise.all(
                guilds.map(async (guild) => {
                    return {
                        ...guild,
                        permissions: await getPermissionsForGuild(
                            guild.guild_id
                        ),
                    }
                })
            )

            const filteredGuildsWithPermissions = mappedGuilds.filter(
                (guild) => {
                    const cacheGuild = client.guilds.cache.find(
                        (cacheGuild) => cacheGuild.id === guild.guild_id
                    )
                    if (!cacheGuild) {
                        return false
                    }
                    if (cacheGuild.ownerId === res.locals.user.id) {
                        return true
                    }
                    if (
                        guild.permissions == null ||
                        guild.permissions?.length === 0
                    ) {
                        console.log('guild', guild.guild_id, 'missing')
                        return false
                    }
                    const guildPermissions = guild.permissions.filter(
                        (guildPermission) =>
                            guildPermission.permission ===
                            Permission.VIEW_SERVER
                    )
                    if (guildPermissions.length === 0) {
                        console.log('guild', guild.guild_id, 'perm length 0')
                        return false
                    }

                    if (
                        !client.guilds.cache.find(
                            (cacheGuild) => cacheGuild.id === guild.guild_id
                        )
                    ) {
                        console.log('guild', guild.guild_id, 'no cache')
                        return false
                    }

                    return true
                }
            )

            if (filteredGuildsWithPermissions.length === 0) {
                return res.sendStatus(204)
            }

            const mappedGuildsWithPermissions =
                await filteredGuildsWithPermissions.reduce(
                    async (
                        resultPromise: Promise<BotGuildItemMember[]>,
                        guild
                    ) => {
                        const cacheGuild = client.guilds.cache.find(
                            (cacheGuild) => cacheGuild.id === guild.guild_id
                        )
                        const resultGuild = await resultPromise
                        if (!cacheGuild) {
                            return resultGuild
                        }
                        const member = await cacheGuild.members.fetch(
                            res.locals.user.id
                        )
                        if (member == null) {
                            return resultGuild
                        }
                        resultGuild.push({
                            ...guild,
                            member,
                            ...(cacheGuild &&
                                cacheGuild.ownerId === member.id && {
                                    isOwner: true,
                                }),
                        })
                        return resultGuild
                    },
                    Promise.resolve([])
                )

            if (mappedGuildsWithPermissions.length === 0) {
                return res.sendStatus(204)
            }

            const myGuilds = mappedGuildsWithPermissions.filter((guild) => {
                if (guild.member == null) {
                    return false
                }
                if (guild.isOwner) {
                    return true
                }
                if (
                    !guild.member.roles.cache.find((role) => {
                        return guild.permissions?.find(
                            (guildPermission) =>
                                guildPermission.role_id === role.id
                        )
                    })
                ) {
                    return false
                }
                return true
            })

            if (myGuilds.length === 0) {
                return res.sendStatus(204)
            }

            return res.send(myGuilds)
        } catch (err) {
            console.log(err)
            return res.sendStatus(500)
        }
    })
    return meRouter
}
