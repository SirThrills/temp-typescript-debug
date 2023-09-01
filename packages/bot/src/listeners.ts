import { AuditLogEvent } from 'discord.js'
import { ChannelLogRecordType } from 'lib-types'
import { client } from './client'
import { getBanAuditLogAuthor } from './helpers/auditlog'
import { addChannelLogRecord } from './helpers/channelLogging'
import { updateGuild, addGuild, removeGuild } from './helpers/database/guild'

client.on('guildBanAdd', async (ban) => {
    const authorId = await getBanAuditLogAuthor(
        client,
        ban,
        AuditLogEvent.MemberBanAdd
    )
    const author = client.users.cache.find((user) => user.id === authorId)
    const fields = [
        {
            name: 'User was unbanned',
            value: `${ban.user.displayName} (${ban.user.id}) was banned`,
        },
    ]
    if (ban.reason) {
        fields.push({ name: 'Reason', value: ban.reason })
    }
    if (author) {
        fields.push({
            name: 'Additional Info',
            value: `Banned by ${author.displayName} (${author.id})`,
        })
    }
    await addChannelLogRecord(client, {
        guild: ban.guild.id,
        type: ChannelLogRecordType.BAN,
        fields,
    })
})

client.on('guildBanRemove', async (ban) => {
    const authorId = await getBanAuditLogAuthor(
        client,
        ban,
        AuditLogEvent.MemberBanRemove
    )
    const author = client.users.cache.find((user) => user.id === authorId)
    const fields = [
        {
            name: 'User was unbanned',
            value: `${ban.user.displayName} (${ban.user.id}) was unbanned`,
        },
    ]
    if (author) {
        fields.push({
            name: 'Additional Info',
            value: `Unbanned by ${author.displayName} (${author.id})`,
        })
    }
    await addChannelLogRecord(client, {
        guild: ban.guild.id,
        type: ChannelLogRecordType.UNBAN,
        fields,
    })
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
