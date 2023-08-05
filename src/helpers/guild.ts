import { Guild } from "discord.js";
import { mysqlClient } from "./database";
import { GuildModel } from "../types";

export const getDatabaseGuilds = async () => {
    const client = (await mysqlClient()).getConn()
    const [rows, _fields] = await client.query<any[]>('SELECT * FROM `guilds`')
    await client.end()
    if (rows == null || rows.length === 0) {
        return
    }
    return rows as GuildModel[]
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