import { v4 } from 'uuid'
import { jeopardyQuery } from 'src/database/database'
import SQL from 'sql-template-strings'
import sqlError from 'src/utils/sql-error'

export type Answer = {
    /** UUID */
    id: string

    /** */
    gameId: string

    /** */
    contestantId: string

    /** */
    clueId: string

    /** The response text that the contestant sent. */
    answerText: string

    /** Whether the answer was considered to be correct. */
    correct: boolean
}

class AnswerModel {
    readonly TABLE_NAME: 'answer'

    public insert = async (input: Answer): Promise<boolean> => {
        const uuid = v4()
        const insertResult = await jeopardyQuery(SQL`
            INSERT INTO ${this.TABLE_NAME}
                (id, gameId, contestantId, questionId, answerText, correct)
            VALUES
                (${uuid}, ${input.gameId}, ${input.contestantId}, ${input.clueId}, ${input.answerText}, ${input.correct});
        `)

        if ('error' in insertResult) {
            sqlError('Error inserting new answer.', insertResult.error)
            return false
        }

        return true
    }
}

export const answerModel = new AnswerModel()
