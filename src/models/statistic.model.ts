import { v4 } from 'uuid'
import { jeopardyQuery } from 'src/database/database'
import SQL from 'sql-template-strings'
import sqlError from 'src/utils/sql-error'
import { z } from 'zod'
import { Model } from './_model'
import { ListOptions } from './list-options'

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

    /** */
    createdAt: z.date(),

    /** */
    updatedAt: z.date(),
})
export type Statistic = z.infer<typeof zStatistic>

export const zStatisticCreate = z.object({
    gameId: z.string().uuid(),
    contestantId: z.string().uuid(),
})
export type StatisticCreate = z.infer<typeof zStatisticCreate>

export const zStatisticUpdate = z.object({
    gameId: z.string().uuid(),
    contestantId: z.string().uuid(),
    value: z.number(),
    isCorrect: z.boolean(),
})
export type StatisticUpdate = z.infer<typeof zStatisticUpdate>

class StatisticModel implements Model<Statistic, StatisticCreate> {
    readonly TableName = 'statistic' as const

    insert = async (input: StatisticCreate): Promise<Statistic | null> => {
        if (zStatisticCreate.safeParse(input).error) {
            console.log(
                'Statistic insert input malformed.',
                JSON.stringify(input)
            )
            return null
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
            return null
        }

        return await this.fetchById(uuid)
    }

    upsert = async (input: StatisticUpdate): Promise<Statistic | null> => {
        if (zStatisticUpdate.safeParse(input).error) {
            console.log(
                'Statistic insert input malformed.',
                JSON.stringify(input)
            )
            return null
        }

        let { statistic, error } = await this.fetchByGameIdAndContestantId(
            input.gameId,
            input.contestantId
        )

        if (error) {
            if (error === 'none-found') {
                statistic = await this.insert({
                    gameId: input.gameId,
                    contestantId: input.contestantId,
                })
            } else {
                return null
            }
        }

        if (input.isCorrect) {
            await jeopardyQuery<Statistic>(SQL`
                UPDATE ${this.TableName}
                SET 
                    score = score + ${input.value},
                    totalAnswers = totalAnswers + 1,
                    correctAnswers = correctAnswers + 1
                WHERE 
                    gameId=${input.gameId} AND contestantId=${input.contestantId};
            `)
        } else {
            await jeopardyQuery<Statistic>(SQL`
                UPDATE ${this.TableName}
                SET 
                    score = score - ${input.value},
                    totalAnswers = totalAnswers + 1,
                    incorrectAnswers = incorrectAnswers + 1
                WHERE 
                    gameId=${input.gameId} AND contestantId=${input.contestantId};
            `)
        }

        return await this.fetchById(statistic?.id as string)
    }

    fetchGlobalLeaderboard = async (
        options: ListOptions
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

    fetchLeaderboardByGameId = async (
        gameId: string,
        options: ListOptions
    ): Promise<Statistic[]> => {
        const queryResult = await jeopardyQuery<Statistic>(SQL`
            SELECT * FROM ${this.TableName} WHERE gameId=${gameId} ORDER BY ${options.sort} ${options.order} LIMIT ${options.limit} OFFSET ${options.offset};
        `)

        if ('error' in queryResult) {
            sqlError(`Error fetching game statistics.`, queryResult.error)
            return []
        }

        return queryResult
    }

    private fetchByGameIdAndContestantId = async (
        gameId: string,
        contestantId: string
    ): Promise<{
        statistic: Statistic | null
        error: 'sql-error' | 'none-found' | 'multiple-found' | null
    }> => {
        const queryResult = await jeopardyQuery<Statistic>(SQL`
            SELECT * FROM ${this.TableName} WHERE gameId=${gameId} AND contestantId=${contestantId};
        `)

        if ('error' in queryResult) {
            sqlError(`Error fetching contestant statistics.`, queryResult.error)
            return { statistic: null, error: 'sql-error' }
        }

        if (queryResult.length === 0) {
            await this.insert({
                gameId,
                contestantId,
            })

            console.error(
                `Statistic not found for gameId ${gameId} and contestantId ${contestantId}`
            )
            return { statistic: null, error: 'none-found' }
        }

        if (queryResult.length > 1) {
            console.error(
                `More than one statistic exists for gameId ${gameId} and contestantId ${contestantId}`
            )
            return { statistic: null, error: 'multiple-found' }
        }

        return { statistic: queryResult[0], error: null }
    }

    fetchById = async (id: string): Promise<Statistic> => {
        throw new Error('Not implemented')
    }
}

export const statisticModel = new StatisticModel()
