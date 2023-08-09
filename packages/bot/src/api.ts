import { Client } from 'discord.js'
import express from 'express'
import { getDatabaseGuilds } from './helpers/database/guild'

export const expressApiApp = (client: Client) => {
    const app = express()

    app.get('/guilds', async (_req, res) => {
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

    app.listen(8081, () => {
        console.log('api ready to serve requests')
    })
}


