import { AuditLogEvent, Client, GuildAuditLogsEntry, GuildBan } from "discord.js";

export const getBanAuditLogAuthor = async (client: Client, ban: GuildBan, type: AuditLogEvent) => {
    const guild = client.guilds.cache.find(guild => guild.id === ban.guild.id)
    if (guild == null) {
        return
    }
    const logs = await guild.fetchAuditLogs({ type, limit: 1, })
    if (logs == null || logs.entries.size === 0) {
        return
    }
    const entry = logs.entries.find((entry) => entry.targetId === ban.user.id)
    if (entry == null) {
        return
    }
    if (entry.executorId == null) {
        return
    }
    return entry.executorId
}