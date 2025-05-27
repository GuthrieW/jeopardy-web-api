import { jeopardyQuery } from 'src/database/database'
import SQL from 'sql-template-strings'
import { v4 } from 'uuid'
import sqlError from 'src/utils/sql-error'

export type Clue = {
    /** UUID */
    id: string

    /** The correct response for the clue. */
    answer: string

    /** The text shown for the clue. */
    clueText: string

    /** The amount of money the clue is worth. */
    value: number

    /** The category the clue was provided under. */
    category: string

    /** The show number during which the clue was aired. */
    showNumber: string

    /** The date during which the clue was aired. */
    airdate: string

    /** The gameId used by J-Archive. Used to ensure we don't store duplicate clues. */
    jArchiveGameId: string

    /** If the clue is flagged as reported by a user. These need to be manually reviewed and updated for if the clue text or answer has a problem. */
    reported: boolean
}

class ClueModel {
    readonly TABLE_NAME = 'clue' as const

    public insert = async (clue: Clue) => {
        const uuid = v4()
        const insertResult = await jeopardyQuery(SQL`
            INSERT INTO ${this.TABLE_NAME}
                (id, answer, clueText, value, category, showNumber, airdate, jArchiveGameId)
            VALUES
                (${uuid}, ${clue.answer}, ${clue.clueText}, ${clue.value}, ${clue.category}, ${clue.showNumber}, ${clue.airdate}, ${clue.jArchiveGameId});
        `)

        if ('error' in insertResult) {
            sqlError('Error inserting new clue.', insertResult.error)
            return false
        }

        return true
    }

    public insertMany = async (clues: Clue[]) => {
        const query = SQL`INSERT INTO ${this.TABLE_NAME} (id, answer, clueText, value, category, showNumber, airdate, jArchiveGameId) VALUES `

        clues.forEach((clue, index) => {
            const uuid = v4()
            if (index !== 0) {
                query.append(',')
            }
            query.append(` (${uuid}, ${clue.answer}, ${clue.clueText}, ${clue.value}, ${clue.category}, ${clue.showNumber}, ${clue.airdate}, ${clue.jArchiveGameId});
`)
        })
        query.append(';')
        const insertResult = await jeopardyQuery(query)

        if ('error' in insertResult) {
            sqlError('Error inserting new clue.', insertResult.error)
            return false
        }

        return true
    }
}

export const clueModel = new ClueModel()
