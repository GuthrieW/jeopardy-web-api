import mysql, { ServerlessMysql } from 'serverless-mysql'
import { SQLStatement } from 'sql-template-strings'

type SelectQueryResult<T> = T[] | { error: unknown }

const initializeDB = (database: string | undefined): ServerlessMysql =>
    mysql({
        config: {
            host: process.env.DATABASE_HOST,
            user: process.env.DATABASE_USER,
            password: process.env.DATABASE_PASSWORD,
            database,
        },
    })

console.log('process.env.NODE_ENV', process.env.NODE_ENV)
const jeopardyDatabase: ServerlessMysql = initializeDB(
    process.env.JEOPARDY_DATABASE_NAME
)

const getQueryFn =
    (db: ServerlessMysql) =>
    async <T>(query: SQLStatement): Promise<SelectQueryResult<T>> => {
        try {
            const results: T[] = await db.query(query)
            await db.end()
            return results
        } catch (error) {
            return { error }
        }
    }

export const jeopardyQuery = getQueryFn(jeopardyDatabase)
