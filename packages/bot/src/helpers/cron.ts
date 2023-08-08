import { Client, Guild } from "discord.js";
import { processGuildRssFeed, processGuildRssQueue } from "./rss";
import { getGuildRssFeeds } from "./database/rss";

const processGuildUpdates = async (guild: Guild) => {
}

export const processGuildsUpdates = async (client: Client) => {
    if (!client.isReady()) {
        return
    }

    client.guilds.cache.forEach(async (guild) => {
        try {
            await processGuildUpdates(guild)
        } catch (err) {
            console.log(err)
        }
    })
}

export const processGuildRssFeeds = async (client: Client) => {
    if (!client.isReady()) {
        return
    }

    client.guilds.cache.forEach(async (guild) => {
        try {
            const feeds = await getGuildRssFeeds(guild.id)
            if (feeds == null) return
            await processGuildRssFeed(guild, feeds)
        } catch (err) {
            console.log(err)
        }
    })
}

export const processGuildRssQueues = async (client: Client) => {
    if (!client.isReady()) {
        return
    }

    client.guilds.cache.forEach(async (guild) => {
        try {
            await processGuildRssQueue(client, guild)
        } catch (err) {
            console.log(err)
        }
    })
}