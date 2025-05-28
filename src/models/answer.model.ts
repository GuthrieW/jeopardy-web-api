import { v4 } from 'uuid'
import { jeopardyQuery } from 'src/database/database'
import SQL from 'sql-template-strings'
import sqlError from 'src/utils/sql-error'
import { z } from 'zod'
import { Model } from './_model'

export const zAnswer = z.object({
    /** UUID */
    id: z.string().uuid(),

    /** */
    gameId: z.string().uuid(),

    /** */
    contestantId: z.string().uuid(),

    /** */
    clueId: z.string().uuid(),

    /** The response text that the contestant sent. */
    answerText: z.string(),

    /** Whether the answer was considered to be correct. */
    isCorrect: z.boolean(),
})

export type Answer = z.infer<typeof zAnswer>

export const zAnswerCreate = z.object({
    gameId: z.string().uuid(),
    contestantId: z.string().uuid(),
    clueId: z.string().uuid(),
    answerText: z.string(),
    isCorrect: z.boolean(),
})

export type AnswerCreate = z.infer<typeof zAnswerCreate>

class AnswerModel implements Model<Answer, AnswerCreate> {
    readonly TableName: 'answer'

    insert = async (input: AnswerCreate): Promise<boolean> => {
        if (zAnswerCreate.safeParse(input).error) {
            console.log('Answer insert input malformed.', JSON.stringify(input))
            return false
        }

        const uuid = v4()
        const insertResult = await jeopardyQuery(SQL`
            INSERT INTO ${this.TableName}
                (id, gameId, contestantId, questionId, answerText, correct)
            VALUES
                (${uuid}, ${input.gameId}, ${input.contestantId}, ${input.clueId}, ${input.answerText}, ${input.isCorrect});
        `)

        if ('error' in insertResult) {
            sqlError('Error inserting new answer.', insertResult.error)
            return false
        }

        return true
    }

    fetchById = async (id: string): Promise<Answer> => {
        throw new Error('Not implemented')
    }
}

export const answerModel = new AnswerModel()
