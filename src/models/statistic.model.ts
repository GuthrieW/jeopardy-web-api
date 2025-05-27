import { v4 } from 'uuid'
import { jeopardyQuery } from 'src/database/database'
import SQL from 'sql-template-strings'
import sqlError from 'src/utils/sql-error'

export type Statistic = {
    /** UUID */
    id: string

    /** */
    gameId: string

    /** */
    contestantId: string

    /** The contestant's score. */
    score: number

    /** The number of responses the user has given. */
    totalAnswers: number

    /** The number of correct responses the user has given. */
    correctAnswers: number

    /** The number of incorrect responses the user has given. */
    incorrectAnswers: number
}

class StatisticModel {
    readonly TABLE_NAME = 'statistic' as const

    /** */
    insert = async (input: Statistic) => {
        const uuid = v4()

        const insertResult = await jeopardyQuery(SQL`
            INSERT INTO ${this.TABLE_NAME}
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
}

export const statisticModel = new StatisticModel()
