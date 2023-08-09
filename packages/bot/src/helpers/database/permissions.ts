import { PermissionItem } from "../../types"
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