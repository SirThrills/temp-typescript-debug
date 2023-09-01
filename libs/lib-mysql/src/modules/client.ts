import * as mysql from 'mysql2/promise'
import { permissions } from './permissions'

export const client = (pool: mysql.Pool) => {
    const permissionsModule = permissions(pool)
    return {
        permissions: permissionsModule,
    }
}
