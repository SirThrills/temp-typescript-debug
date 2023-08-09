import { AuditLogEvent, Client, GatewayIntentBits } from 'discord.js'
import dotenv from 'dotenv'
import { addChannelLogRecord } from './helpers/channelLogging'
import { ChannelLogRecordType } from './types'
import { sleep } from './helpers/sleep'
import { addGuild, removeGuild, updateActiveGuilds, updateGuild } from './helpers/database/guild'
import { getBanAuditLogAuthor } from './helpers/auditlog'
import { CronJob } from 'cron'
import { processGuildRssFeeds, processGuildRssQueues, processGuildsUpdates } from './helpers/cron'
import { expressApiApp } from './api'

dotenv.config()

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers, GatewayIntentBits.GuildPresences] })
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

client.on('guildBanAdd', async (ban) => {
    const authorId = await getBanAuditLogAuthor(client, ban, AuditLogEvent.MemberBanAdd)
    const author = client.users.cache.find((user) => user.id === authorId)
    const fields = [{ name: 'User was unbanned', value: `${ban.user.displayName} (${ban.user.id}) was banned` }]
    if (ban.reason) {
        fields.push({ name: 'Reason', value: ban.reason })
    }
    if (author) {
        fields.push({ name: 'Additional Info', value: `Banned by ${author.displayName} (${author.id})` })
    }
    await addChannelLogRecord(client, { guild: ban.guild.id, type: ChannelLogRecordType.BAN, fields })
})

client.on('guildBanRemove', async (ban) => {
    const authorId = await getBanAuditLogAuthor(client, ban, AuditLogEvent.MemberBanRemove)
    const author = client.users.cache.find((user) => user.id === authorId)
    const fields = [{ name: 'User was unbanned', value: `${ban.user.displayName} (${ban.user.id}) was unbanned` }]
    if (author) {
        fields.push({ name: 'Additional Info', value: `Unbanned by ${author.displayName} (${author.id})` })
    }
    await addChannelLogRecord(client, { guild: ban.guild.id, type: ChannelLogRecordType.UNBAN, fields })
})

client.on('guildUpdate', async (guild) => {
    const updatedGuild = await client.guilds.fetch(guild.id)
    try {
        await updateGuild(updatedGuild)
    } catch (err) {
        console.log(err)
    }
})

client.on('guildCreate', async (guild) => {
    try {
        await addGuild(guild)
    } catch (err) {
        console.log(err)
    }
})

client.on('guildDelete', async (guild) => {
    try {
        await removeGuild(guild.id)
    } catch (err) {
        console.log(err)
    }
})

const createCronJobs = (client: Client) => {
    new CronJob({ cronTime: '* * * * *', onTick: async function () { await processGuildsUpdates(client) }, start: true })
    new CronJob({ cronTime: '* * * * *', onTick: async function () { await processGuildRssFeeds(client) }, start: true })
    new CronJob({ cronTime: '* * * * *', onTick: async function () { await processGuildRssQueues(client) }, start: true })
}

createCronJobs(client)
client.login(process.env.BOT_TOKEN)
