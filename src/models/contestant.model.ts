import { v4 } from 'uuid'
import { jeopardyQuery } from 'src/database/database'
import SQL from 'sql-template-strings'
import sqlError from 'src/utils/sql-error'

export type Contestant = {
    /** UUID */
    id: string

    /** */
    gameId: string

    /** The contestants name. */
    name: string
}

class ContestantModel {
    readonly TABLE_NAME = 'contestant' as const

    /** */
    insert = async (input: Contestant) => {
        const uuid = v4()

        const insertResult = await jeopardyQuery(SQL`
            INSERT INTO ${this.TABLE_NAME}
                (id, gameId, name)
            VALUES
                (${uuid}, ${input.gameId}, ${input.name});
        `)

        if ('error' in insertResult) {
            sqlError('Error inserting new contestant.', insertResult.error)
            return false
        }

        return true
    }
}

export const contestantModel = new ContestantModel()
