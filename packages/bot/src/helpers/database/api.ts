import { mysqlClient } from "./client"

type WebSession = {
    id: string
    discord_access_token: string
    jwt_access_token: string
    jwt_secret: string
    user_id: string
    expires_in: number
    added: Date
}

export const getWebSession = async (jwtToken: string): Promise<WebSession | undefined> => {
    const client = (await mysqlClient()).getConn()
    const [rows, _fields] = await client.query<any[]>('SELECT * FROM `web_sessions` WHERE `jwt_access_token` = ?', [jwtToken])
    await client.end()
    if (rows == null || rows.length !== 1) {
        return
    }
    return rows[0]
}

export const addWebSession = async (discordToken: string, jwtToken: string, jwtSecret: string, userId: string, expiresIn: number) => {
    const client = (await mysqlClient()).getConn()
    await client.query<any[]>('INSERT INTO `web_sessions` (`discord_access_token`, `jwt_access_token`, `jwt_secret`, `user_id`, `expires_in`) VALUES (?,?,?,?,?)', [discordToken, jwtToken, jwtSecret, userId, expiresIn])
    await client.end()
}

export const deleteWebSession = async (jwtToken: string) => {
    const client = (await mysqlClient()).getConn()
    await client.query<any[]>('DELETE FROM `web_sessions` WHERE `jwt_access_token` = ?', [jwtToken])
    await client.end()
}