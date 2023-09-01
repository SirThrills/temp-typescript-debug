import mysql from 'mysql2/promise'

type Credentials = {
    host: string
    username: string
    password: string
    database: string
    port?: number
}

const mapCredentials = (credentials: Credentials) => {
    let port = credentials.port ?? 3306
    return {
        host: credentials.host,
        user: credentials.username,
        password: credentials.password,
        database: credentials.database,
        port,
    }
}

export const createPool = (credentials: Credentials) => {
    return mysql.createPool(mapCredentials(credentials))
}
