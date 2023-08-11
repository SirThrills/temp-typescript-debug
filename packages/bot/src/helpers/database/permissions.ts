import { Permission, PermissionItem } from "../../types"
import { mysqlClient } from "./client"

export const getPermissionsForGuild = async (guildId: string): Promise<PermissionItem[] | undefined> => {
    const client = (await mysqlClient()).getConn()
    const [rows, _fields] = await client.query<any[]>('SELECT * FROM `guild_role_permissions` WHERE `guild_id` = ?', [guildId])
    await client.end()
    if (rows == null || rows.length === 0) {
        return
    }
    return rows
}

export const getPermissionsForGuildRole = async (guildId: string, roleId: string): Promise<PermissionItem[] | undefined> => {
    const client = (await mysqlClient()).getConn()
    const [rows, _fields] = await client.query<any[]>('SELECT * FROM `guild_role_permissions` WHERE `guild_id` = ? AND `role_id` = ?', [guildId, roleId])
    await client.end()
    if (rows == null || rows.length === 0) {
        return
    }
    return rows
}

export const getGuildRolesByPermission = async (guildId: string, permission: Permission): Promise<PermissionItem[] | undefined> => {
    const client = (await mysqlClient()).getConn()
    const [rows, _fields] = await client.query<any[]>('SELECT * FROM `guild_role_permissions` WHERE `guild_id` = ? AND `permission` = ?', [guildId, permission])
    await client.end()
    if (rows == null || rows.length === 0) {
        return
    }
    return rows
}