import mysql from 'mysql2/promise'
import { Permission, PermissionItem } from 'lib-types'

export const permissions = (pool: mysql.Pool) => {
    return {
        async getPermissionsForGuild<T>(
            guildId: string
        ): Promise<PermissionItem[] | undefined> {
            const client = await pool.getConnection()
            const [rows, _fields] = await client.query<any[]>(
                'SELECT * FROM `guild_role_permissions` WHERE `guild_id` = ?',
                [guildId]
            )
            client.release()
            if (rows == null || rows.length === 0) {
                return
            }
            return rows
        },
        async getPermissionsForGuildRole(
            guildId: string,
            roleId: string
        ): Promise<PermissionItem[] | undefined> {
            const client = await pool.getConnection()
            const [rows, _fields] = await client.query<any[]>(
                'SELECT * FROM `guild_role_permissions` WHERE `guild_id` = ? AND `role_id` = ?',
                [guildId, roleId]
            )
            client.release()
            if (rows == null || rows.length === 0) {
                return
            }
            return rows
        },
        async getGuildRolesByPermission(
            guildId: string,
            permission: Permission
        ): Promise<PermissionItem[] | undefined> {
            const client = await pool.getConnection()
            const [rows, _fields] = await client.query<any[]>(
                'SELECT * FROM `guild_role_permissions` WHERE `guild_id` = ? AND `permission` = ?',
                [guildId, permission]
            )
            client.release()
            if (rows == null || rows.length === 0) {
                return
            }
            return rows
        },
        async getGuildRolePermission(
            guildId: string,
            roleId: string,
            permission: Permission
        ): Promise<PermissionItem | undefined> {
            const client = await pool.getConnection()
            const [rows, _fields] = await client.query<any[]>(
                'SELECT * FROM `guild_role_permissions` WHERE `guild_id` = ? AND `role_id` = ? AND `permission` = ?',
                [guildId, roleId, permission]
            )
            client.release()
            if (rows == null) {
                return
            }
            if (rows.length > 1) {
                throw new Error(
                    'Received more than 1 row for a unique column set'
                )
            }
            return rows[0]
        },
        async addGuildRolePermission(
            guildId: string,
            roleId: string,
            permission: Permission
        ) {
            const client = await pool.getConnection()
            await client.execute(
                'INSERT INTO `guild_role_permissions` (`guild_id`, `role_id`, `permission`) VALUES (?,?,?)',
                [guildId, roleId, permission]
            )
            client.release()
        },
        async deleteGuildRolePermission(
            guildId: string,
            roleId: string,
            permission: Permission
        ) {
            const client = await pool.getConnection()
            await client.execute(
                'DELETE FROM `guild_role_permissions` WHERE `guild_id` = ? AND `role_id` = ? AND `permission` = ?',
                [guildId, roleId, permission]
            )
            client.release()
        },
    }
}
