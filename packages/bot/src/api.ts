import { Client, User } from 'discord.js'
import express, { Request, Response, NextFunction } from 'express'
import { getDatabaseGuilds } from './helpers/database/guild'
import { getAuthTokenUser } from './helpers/database/api'
import { getPermissionsForGuild } from './helpers/database/permissions'
import { BotGuildItemMember, Permission } from './types'

const getCacheUser = async (client: Client, userId: string, fetch: boolean = false): Promise<User | undefined> => {
    if (fetch) {
        console.log(`fetching ${userId} from non-cache`)
        return await client.users.fetch(userId)
    }
    const user = client.users.cache.find((user) => user.id === userId)
    if (user == null) {
        return await getCacheUser(client, userId, true)
    }
    return user
}

const authMiddleware = (client: Client) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        if (req.headers.authorization == null) {
            return res.status(401).send({ error: 'missing_header' })
        }
        const token = req.headers.authorization.split(' ')[1];
        if (!token) {
            return res.status(401).send({ error: 'invalid_header' })
        }
        const userSession = await getAuthTokenUser(token)
        if (userSession == null) {
            return res.status(401).send({ error: 'invalid_user' })
        }

        const user = await getCacheUser(client, userSession.user_id)
        if (user == null) {
            return res.status(401).send({ error: 'invalid_cache_user', userId: userSession.user_id })
        }
        res.locals.user = user
        next()
    }
}

export const expressApiApp = (client: Client) => {
    const app = express()

    app.get('/guilds', authMiddleware(client), async (_req, res) => {
        if (res.locals.user == null) {
            return res.sendStatus(400)
        }

        let guilds
        try {
            guilds = await getDatabaseGuilds()
        } catch (err) {
            console.log(err)
            return res.sendStatus(500)
        }

        if (guilds == null) {
            return res.sendStatus(204)
        }

        res.send(guilds)
    })

    app.get('/@me/guilds', authMiddleware(client), async (req, res) => {
        if (res.locals.user == null) {
            return res.sendStatus(400)
        }

        console.log("hello")

        try {
            const guilds = await getDatabaseGuilds()
            if (guilds == null || guilds.length === 0) {
                console.log("hello1")
                return res.sendStatus(204)
            }
            const mappedGuilds = await Promise.all(guilds.map(async (guild) => {
                return {
                    ...guild,
                    permissions: await getPermissionsForGuild(guild.guild_id)
                }
            }))

            const filteredGuildsWithPermissions = mappedGuilds.filter((guild) => {
                const cacheGuild = client.guilds.cache.find(cacheGuild => cacheGuild.id === guild.guild_id)
                if (!cacheGuild) {
                    return false
                }
                if (cacheGuild.ownerId === res.locals.user.id) {
                    return true
                }
                if (guild.permissions == null || guild.permissions?.length === 0) {
                    console.log('guild', guild.guild_id, 'missing')
                    return false
                }
                const guildPermissions = guild.permissions.filter((guildPermission) => guildPermission.permission === Permission.VIEW_SERVER)
                if (guildPermissions.length === 0) {
                    console.log('guild', guild.guild_id, 'perm length 0')
                    return false
                }

                if (!client.guilds.cache.find(cacheGuild => cacheGuild.id === guild.guild_id)) {
                    console.log('guild', guild.guild_id, 'no cache')
                    return false
                }

                return true
            })

            if (filteredGuildsWithPermissions.length === 0) {
                return res.sendStatus(204)
            }

            const mappedGuildsWithPermissions = await filteredGuildsWithPermissions.reduce(async (resultPromise: Promise<BotGuildItemMember[]>, guild) => {
                const cacheGuild = client.guilds.cache.find(cacheGuild => cacheGuild.id === guild.guild_id)
                const resultGuild = await resultPromise
                if (!cacheGuild) {
                    return resultGuild
                }
                const member = await cacheGuild.members.fetch(res.locals.user.id)
                if (member == null) {
                    return resultGuild
                }
                resultGuild.push({
                    ...guild,
                    member,
                    ...cacheGuild && cacheGuild.ownerId === member.id && {
                        isOwner: true
                    }
                })
                return resultGuild
            }, Promise.resolve([]))

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
                if (!guild.member.roles.cache.find((role) => {
                    return guild.permissions?.find((guildPermission) => guildPermission.role_id === role.id)
                })) {
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

    app.get('/guilds/:guildId/roles', authMiddleware(client), async (req, res) => {
        if (res.locals.user == null) {
            return res.sendStatus(400)
        }

        const guild = client.guilds.cache.find((guild) => guild.id === req.params.guildId)
        if (guild == null) {
            return res.sendStatus(400)
        }

        const member = guild.members.cache.find((member) => member.id === res.locals.user.id)
        if (member == null) {
            return res.sendStatus(400)
        }

        res.send(guild.roles.cache.map((role) => {
            return {
                id: role.id,
                name: role.name
            }
        }))
    })

    app.listen(8081, () => {
        console.log('api ready to serve requests')
    })
}


