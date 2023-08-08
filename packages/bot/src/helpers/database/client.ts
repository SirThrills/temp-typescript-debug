import mysql from 'mysql2/promise'
import dotenv from 'dotenv'

dotenv.config()

export const mysqlClient = async () => {
    let connection = await mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASS,
        database: process.env.DB_NAME
    })
    return {
        getConn() {
            return connection
        },
        async close() {
            await connection.end()
        }
    }
}