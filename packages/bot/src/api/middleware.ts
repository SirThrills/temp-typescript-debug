import { Client, User } from "discord.js"
import { Request, Response, NextFunction } from "express"
import { deleteWebSession, getWebSession } from "../helpers/database/api"
import jwt from 'jsonwebtoken'

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

export const authMiddleware = (client: Client) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            if (req.headers.authorization == null) {
                return res.status(401).send({ error: 'missing_header' })
            }
            const token = req.headers.authorization.split(' ')[1];
            if (!token) {
                return res.status(401).send({ error: 'invalid_header' })
            }
            const userSession = await getWebSession(token)
            if (userSession == null) {
                return res.status(401).send({ error: 'invalid_user' })
            }

            try {
                jwt.verify(userSession.jwt_access_token, userSession.jwt_secret)
            } catch (err) {
                await deleteWebSession(userSession.jwt_access_token)
                return res.status(401).send({ error: 'token_mismatch' })
            }

            if (Date.now() > Date.now() + userSession.expires_in) {
                await deleteWebSession(userSession.jwt_access_token)
                return res.status(401).send({ error: 'session_expired', userId: userSession.user_id })
            }

            const user = await getCacheUser(client, userSession.user_id)
            if (user == null) {
                await deleteWebSession(userSession.jwt_access_token)
                return res.status(401).send({ error: 'invalid_cache_user', userId: userSession.user_id })
            }
            res.locals.user = user
            res.locals.discord_access_token = userSession.discord_access_token
            res.locals.jwt_access_token = userSession.jwt_access_token
            next()
        } catch (err) {
            console.log(err)
            return res.sendStatus(500)
        }
    }
}
