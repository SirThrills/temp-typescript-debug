import { client, createPool } from 'lib-mysql'
import { config } from 'dotenv'

config()
const pool = createPool({
    host: process.env.DB_HOST || 'localhost',
    username: process.env.DB_USER || 'user',
    password: process.env.DB_PASS || 'pass',
    database: process.env.DB_NAME || 'database',
})

export const db = client(pool)
