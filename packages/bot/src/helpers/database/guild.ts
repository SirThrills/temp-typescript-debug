import { Client, Guild } from "discord.js";
import { mysqlClient } from "./client";
import { ChannelLogRecordType, GuildItem, GuildRssFeedItem, GuildRssPostItem, GuildRssQueueItem } from "../../types";
import { addChannelLogRecord } from "../channelLogging";

export const updateActiveGuilds = async (client: Client) => {
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

export const getDatabaseGuilds = async () => {
    const client = (await mysqlClient()).getConn()
    const [rows, _fields] = await client.query<any[]>('SELECT * FROM `guilds`')
    await client.end()
    if (rows == null || rows.length === 0) {
        return
    }
    return rows as GuildItem[]
}

export const addGuild = async (guild: Guild) => {
    const client = (await mysqlClient()).getConn()
    await client.query<any[]>('INSERT INTO `guilds` (`guild_id`, `guild_name`, `guild_icon`) VALUES (?,?,?)', [guild.id, guild.name, guild.iconURL()])
    await client.end()
}

export const updateGuild = async (guild: Guild) => {
    const client = (await mysqlClient()).getConn()
    await client.query<any[]>('UPDATE `guilds` SET `guild_name` = ?, `guild_icon` = ? WHERE `guild_id` = ?', [guild.name, guild.iconURL(), guild.id])
    await client.end()
}

export const removeGuild = async (guildId: string) => {
    const client = (await mysqlClient()).getConn()
    await client.query<any[]>('DELETE FROM `guilds` WHERE `guild_id` = ?', [guildId])
    await client.end()
}