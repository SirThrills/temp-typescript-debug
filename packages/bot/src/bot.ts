import dotenv from 'dotenv'
import { sleep } from './helpers/sleep'
import { updateActiveGuilds } from './helpers/database/guild'
import { CronJob } from 'cron'
import {
    processGuildRssFeeds,
    processGuildRssQueues,
    processGuildsUpdates,
} from './helpers/cron'
import { expressApiApp } from './api/api'
import { client } from './client'
import { Client } from 'discord.js'

dotenv.config()
const env = process.env.NODE_ENV || 'local'

client.on('ready', async () => {
    // Sleep for 5s at startup in local for docker compose mariadb image to boot
    if (env === 'local') {
        await sleep(5000)
    }

    try {
        await updateActiveGuilds(client)
    } catch (err) {
        console.log('Failed to update active guilds')
        console.log(err)
    }

    expressApiApp(client)
})

const createCronJobs = (client: Client) => {
    console.log('loading cron jobs...')
    new CronJob({
        cronTime: '* * * * *',
        onTick: async function () {
            await processGuildsUpdates(client)
        },
        start: true,
    })
    new CronJob({
        cronTime: '* * * * *',
        onTick: async function () {
            await processGuildRssFeeds(client)
        },
        start: true,
    })
    new CronJob({
        cronTime: '* * * * *',
        onTick: async function () {
            await processGuildRssQueues(client)
        },
        start: true,
    })
}

console.log('bot starting...')
createCronJobs(client)
console.log('connecting to discord')
client.login(process.env.BOT_TOKEN)
