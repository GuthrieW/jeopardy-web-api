import { jeopardyQuery } from 'src/database/database'
import SQL from 'sql-template-strings'
import { v4 } from 'uuid'
import sqlError from 'src/utils/sql-error'
import { z } from 'zod'
import { Model } from './_model'

export const zClue = z.object({
    /** UUID */
    id: z.string().uuid(),

    /** The correct response for the clue. */
    answerText: z.string(),

    /** The text shown for the clue. */
    clueText: z.string(),

    /** The amount of money the clue is worth. */
    value: z.number(),

    /** The category the clue was provided under. */
    category: z.string(),

    /** The show number during which the clue was aired. */
    showNumber: z.string(),

    /** The date during which the clue was aired. */
    airDate: z.string(),

    /** The gameId used by J-Archive. Used to ensure we don't store duplicate clues. */
    jArchiveGameId: z.string(),

    /** If the clue is flagged as reported by a user. These need to be manually reviewed and updated for if the clue text or answer has a problem. */
    isFlagged: z.boolean(),

    /** */
    createdAt: z.date(),

    /** */
    updatedAt: z.date(),
})

export type Clue = z.infer<typeof zClue>

export const zClueCreate = z.object({
    answerText: z.string(),
    clueText: z.string(),
    value: z.number(),
    category: z.string(),
    showNumber: z.string(),
    airDate: z.string(),
    jArchiveGameId: z.string(),
})

export type ClueCreate = z.infer<typeof zClueCreate>

class ClueModel implements Model<Clue, ClueCreate> {
    readonly TableName = 'clue' as const

    /**
     *
     */
    insert = async (input: ClueCreate): Promise<Clue | null> => {
        if (zClueCreate.safeParse(input).error) {
            console.log('Clue insert input malformed.', JSON.stringify(input))
            return null
        }

        const uuid = v4()
        const insertResult = await jeopardyQuery(SQL`
            INSERT INTO ${this.TableName}
                (id, answer, clueText, value, category, showNumber, airDate, jArchiveGameId)
            VALUES
                (${uuid}, ${input.answerText}, ${input.clueText}, ${input.value}, ${input.category}, ${input.showNumber}, ${input.airDate}, ${input.jArchiveGameId});
        `)

        if ('error' in insertResult) {
            sqlError('Error inserting new clue.', insertResult.error)
            return null
        }

        return await this.fetchById(uuid)
    }

    /**
     *
     */
    insertMany = async (inputs: ClueCreate[]): Promise<boolean> => {
        const query = SQL`INSERT INTO ${this.TableName} (id, answer, clueText, value, category, showNumber, airDate, jArchiveGameId) VALUES `

        inputs.forEach((input, index) => {
            const uuid = v4()
            if (index !== 0) {
                query.append(',')
            }
            query.append(` (${uuid}, ${input.answerText}, ${input.clueText}, ${input.value}, ${input.category}, ${input.showNumber}, ${input.airDate}, ${input.jArchiveGameId})
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

    /**
     *
     */
    fetchById = async (id: string): Promise<Clue | null> => {
        const queryResult = await jeopardyQuery<Clue>(
            SQL`SELECT * FROM ${this.TableName} ORDER BY RAND() LIMIT 1;`
        )

        if ('error' in queryResult) {
            sqlError('Error fetching random clue.', queryResult.error)
            return null
        }

        if (queryResult.length === 0) {
            console.error(`Clue with id ${id} not found.`)
            return null
        }

        if (queryResult.length > 1) {
            console.error(`Multiple clues with id ${id} found.`)
            return null
        }

        return queryResult[0]
    }

    /**
     *
     */
    fetchRandom = async (): Promise<Clue | null> => {
        const queryResult = await jeopardyQuery<Clue>(
            SQL`SELECT * FROM ${this.TableName} ORDER BY RAND() LIMIT 1;`
        )

        if ('error' in queryResult) {
            sqlError('Error fetching random clue.', queryResult.error)
            return null
        }

        if (queryResult.length === 0) {
            console.error(`Unable to fetch random clue.`)
            return null
        }

        return queryResult[0]
    }
}

export const clueModel = new ClueModel()
