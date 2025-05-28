import { v4 } from 'uuid'
import { jeopardyQuery } from 'src/database/database'
import SQL from 'sql-template-strings'
import sqlError from 'src/utils/sql-error'
import { z } from 'zod'
import { Model } from './_model'
import { ListOptions } from './_list-options'

export const zStatistic = z.object({
    /** UUID */
    id: z.string().uuid(),

    /** */
    gameId: z.string().uuid(),

    /** */
    contestantId: z.string().uuid(),

    /** The contestant's score. */
    score: z.number(),

    /** The number of responses the user has given. */
    totalAnswers: z.number(),

    /** The number of correct responses the user has given. */
    correctAnswers: z.number(),

    /** The number of incorrect responses the user has given. */
    incorrectAnswers: z.number(),
})

export type Statistic = z.infer<typeof zStatistic>

export const zStatisticCreate = z.object({
    gameId: z.string().uuid(),
    contestantId: z.string().uuid(),
})

export type StatisticCreate = z.infer<typeof zStatisticCreate>

class StatisticModel implements Model<Statistic, StatisticCreate> {
    readonly TableName = 'statistic' as const

    /** */
    insert = async (input: StatisticCreate): Promise<boolean> => {
        if (zStatisticCreate.safeParse(input).error) {
            console.log(
                'Statistic insert input malformed.',
                JSON.stringify(input)
            )
            return false
        }

        const uuid = v4()
        const insertResult = await jeopardyQuery(SQL`
            INSERT INTO ${this.TableName}
                (id, gameId, contestantId)
            VALUES
                (${uuid}, ${input.gameId}, ${input.contestantId});
        `)

        if ('error' in insertResult) {
            sqlError(`Error inserting new statistic.`, insertResult.error)
            return false
        }

        return true
    }

    fetchGlobalLeaderboard = async (
        options: ListOptions<Statistic>
    ): Promise<Statistic[]> => {
        const queryResult = await jeopardyQuery<Statistic>(SQL`
            SELECT * FROM ${this.TableName} ORDER BY ${options.sort} ${options.order} LIMIT ${options.limit} OFFSET ${options.offset};
        `)

        if ('error' in queryResult) {
            sqlError(`Error inserting new statistic.`, queryResult.error)
            return []
        }

        return queryResult
    }

    fetchGameLeaderboard = async (
        gameId: string,
        options: ListOptions<Statistic>
    ): Promise<Statistic[]> => {
        const queryResult = await jeopardyQuery<Statistic>(SQL`
            SELECT * FROM ${this.TableName} WHERE gameId=${gameId} ORDER BY ${options.sort} ${options.order} LIMIT ${options.limit} OFFSET ${options.offset};
        `)

        if ('error' in queryResult) {
            sqlError(`Error inserting new statistic.`, queryResult.error)
            return []
        }

        return queryResult
    }

    fetchById = async (id: string): Promise<Statistic> => {
        throw new Error('Not implemented')
    }
}

export const statisticModel = new StatisticModel()
