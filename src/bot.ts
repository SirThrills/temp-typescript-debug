import { Client, GatewayIntentBits } from 'discord.js'
import dotenv from 'dotenv'
import { addChannelLogRecord } from './helpers/channelLogging'
import { ChannelLogRecordType } from './types'
import { sleep } from './helpers/sleep'
import { getDatabaseGuilds, updateGuild, addGuild, removeGuild } from './helpers/guild'
import { getBanAuditLogUser } from './helpers/auditlog'

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
    const user = await getBanAuditLogUser(client, ban)
    await addChannelLogRecord(client, { guild: ban.guild.id, type: ChannelLogRecordType.BAN })
})

const updateActiveGuilds = async (client: Client) => {
    const guilds = client.guilds.cache
    const dbGuilds = await getDatabaseGuilds()
    for (const guild of guilds) {
        if (dbGuilds && dbGuilds.find((dbGuild) => dbGuild.guild_id === guild[1].id)) {
            console.log('Updating guild', guild[1].id)
            await updateGuild(guild[1])
            await addChannelLogRecord(client, { guild: guild[1].id, type: ChannelLogRecordType.SYSTEM, fields: [{ name: 'Guild Metadata Updated', value: 'Database metadata updated for this guild' }] })
            continue
        }
        console.log('Adding guild:', guild[1].id)
        await addGuild(guild[1])
    }

    if (!dbGuilds) {
        return
    }
    for (const dbGuild of dbGuilds) {
        if (guilds.find((guild) => guild.id === dbGuild.guild_id)) {
            continue
        }
        console.log('Removing guild:', dbGuild.guild_id)
        await removeGuild(dbGuild.guild_id)
    }
}

client.login(process.env.BOT_TOKEN)