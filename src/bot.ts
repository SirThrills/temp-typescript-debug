import { Client, GatewayIntentBits } from 'discord.js'
import dotenv from 'dotenv'
import { addChannelLogRecord } from './helpers/channelLogging'
import { ChannelLogRecordType } from './types'
import { sleep } from './helpers/sleep'
import { addGuild, removeGuild, updateActiveGuilds } from './helpers/database/guild'
import { getBanAuditLogAuthor } from './helpers/auditlog'
import { CronJob } from 'cron'
import { processGuildRssFeeds, processGuildRssQueues, processGuildsUpdates } from './helpers/cron'

dotenv.config()

const client = new Client({ intents: [GatewayIntentBits.Guilds] })

client.on('ready', async () => {
    await sleep(5000)
    try {
        await updateActiveGuilds(client)
    } catch (err) {
        console.log('Failed to update active guilds')
        console.log(err)
    }
})

client.on('guildBanAdd', async (ban) => {
    const author = await getBanAuditLogAuthor(client, ban)
    await addChannelLogRecord(client, { guild: ban.guild.id, type: ChannelLogRecordType.BAN })
})

client.on('guildCreate', async (guild) => {
    await addGuild(guild)
})

client.on('guildDelete', async (guild) => {
    await removeGuild(guild.id)
})

const createCronJobs = (client: Client) => {
    new CronJob({ cronTime: '* * * * *', onTick: async function () { await processGuildsUpdates(client) }, start: true })
    new CronJob({ cronTime: '* * * * *', onTick: async function () { await processGuildRssFeeds(client) }, start: true })
    new CronJob({ cronTime: '* * * * *', onTick: async function () { await processGuildRssQueues(client) }, start: true })
}

createCronJobs(client)
client.login(process.env.BOT_TOKEN)
