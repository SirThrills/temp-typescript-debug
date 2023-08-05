import { ChannelType, Client, EmbedBuilder, GuildChannel } from "discord.js";
import { ChannelLogRecord, ChannelLogRecordType, GuildChannelLogModel } from "../types";
import { mysqlClient } from "./database";

export const addChannelLogRecord = async (client: Client, record: ChannelLogRecord) => {
    const guild = client.guilds.cache.find((guild) => guild.id === record.guild)
    if (guild == null) {
        return
    }

    const recordChannel = await getChannel(record)
    if (recordChannel == null) {
        return
    }
    const channel = guild.channels.cache.find((channel) => channel.id === recordChannel)
    if (channel == null || channel.type !== ChannelType.GuildText) {
        return
    }

    const titleAndColor = getTitleAndColor(record.type)
    if (titleAndColor == null) {
        return
    }

    const embed = new EmbedBuilder()
    embed.setTitle(titleAndColor.title)
    embed.setColor(titleAndColor.color)
    if (record.url) {
        embed.setURL(record.url)
    }
    if (record.description) {
        embed.setDescription(record.description)
    }
    if (record.fields) {
        embed.addFields(record.fields)
    }
    if (record.timestamp == null || record.timestamp) {
        embed.setTimestamp()
    }

    await channel.send({ embeds: [embed] })
}

const getChannel = async (record: ChannelLogRecord): Promise<string | undefined> => {
    const client = (await mysqlClient()).getConn()
    const [rows, _fields] = await client.execute<any[]>('SELECT * FROM `guild_channel_logs` WHERE `guild_id` = ? AND `channel_type` = ?', [record.guild, record.type])
    await client.end()
    console.log('db rows:', rows, 'params:', [record.guild, record.type])
    if (rows == null || rows.length !== 1) {
        return
    }
    return rows[0].channel_id
}

const getTitleAndColor = (type: ChannelLogRecordType) => {
    switch (type) {
        case ChannelLogRecordType.BAN: {
            return { title: 'User Banned', color: 0x0099FF }
        }
        case ChannelLogRecordType.UNBAN: {
            return { title: 'User Unbanned', color: 0x0099FF }
        }
        case ChannelLogRecordType.KICK: {
            return { title: 'User Kicked', color: 0x0099FF }
        }
        case ChannelLogRecordType.WARNING: {
            return { title: 'User Unbanned', color: 0x0099FF }
        }
        case ChannelLogRecordType.UNWARN: {
            return { title: 'User Unbanned', color: 0x0099FF }
        }
        case ChannelLogRecordType.TEXT: {
            return { title: 'Text Message', color: 0x0099FF }
        }
        case ChannelLogRecordType.SYSTEM: {
            return { title: 'System Message', color: 0x0099FF }
        }
        case ChannelLogRecordType.TEST: {
            return { title: 'Test Message', color: 0x0099FF }
        }
    }
    return
}