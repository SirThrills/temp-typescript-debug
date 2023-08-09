import { mysqlClient } from "./client"

type WebSession = {
    id: string
    auth_token: string
    user_id: string
    expires_in: number
    added: Date
}

export const getAuthTokenUser = async (authToken: string): Promise<WebSession | undefined> => {
    const client = (await mysqlClient()).getConn()
    const [rows, _fields] = await client.query<any[]>('SELECT * FROM `web_sessions` WHERE `auth_token` = ?', [authToken])
    await client.end()
    if (rows == null || rows.length !== 1) {
        return
    }
    return rows[0]
}