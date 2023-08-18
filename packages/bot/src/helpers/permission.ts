import { Client, Guild, User } from "discord.js";
import { Permission } from "../types";
import { getGuildRolesByPermission } from "./database/permissions";

export const userHasPermission = async (client: Client, guild: Guild, user: User, permission: Permission) => {
    if (guild.ownerId === user.id) {
        return true
    }

    const guildPermissionRoles = await getGuildRolesByPermission(guild.id, permission)
    if (guildPermissionRoles == null) {
        return false
    }

    const member = guild.members.cache.find(member => member.id === user.id)
    if (member == null) {
        return false
    }

    for (const guildPermissionRole of guildPermissionRoles) {
        if (member.roles.cache.find(role => role.id === guildPermissionRole.role_id)) {
            return true
        }
    }
    return false
}