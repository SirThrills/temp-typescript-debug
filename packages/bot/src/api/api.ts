import { Client, User } from 'discord.js'
import express from 'express'
import { oauthRouterMiddleware } from './oauth'
import cors from 'cors'
import helmet from 'helmet'
import { guildsRouterHandler } from './guilds'
import { meRouterHandler } from './me'

declare global {
    namespace Express {
        interface Locals {
            user: User
        }
    }
}

export const expressApiApp = (client: Client) => {
    const app = express()

    app.use(cors({
        origin: 'http://localhost',
        credentials: true,
    }))
    app.use(helmet())

    app.use('/oauth', oauthRouterMiddleware(client))
    app.use('/guilds', guildsRouterHandler(client))
    app.use('/me', meRouterHandler(client))

    app.listen(8080, () => {
        console.log('api ready to serve requests')
    })
}
