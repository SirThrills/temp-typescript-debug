import { EmbedBuilder } from 'discord.js'
import { EmbedItem } from 'lib-types'

export const createEmbed = (embedItem: EmbedItem) => {
    const embed = new EmbedBuilder()
    embed.setTitle(embedItem.title)
    embed.setColor(embedItem.color)
    if (embedItem.url) {
        embed.setURL(embedItem.url)
    }
    if (embedItem.description) {
        embed.setDescription(embedItem.description)
    }
    if (embedItem.thumbnail) {
        embed.setThumbnail(embedItem.thumbnail)
    }
    if (embedItem.image) {
        embed.setImage(embedItem.image)
    }
    if (embedItem.fields) {
        embed.addFields(embedItem.fields)
    }
    if (embedItem.timestamp == null || embedItem.timestamp) {
        embed.setTimestamp()
    }

    return embed
}
