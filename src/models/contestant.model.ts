import { v4 } from 'uuid'
import { jeopardyQuery } from 'src/database/database'
import SQL from 'sql-template-strings'
import sqlError from 'src/utils/sql-error'
import { z } from 'zod'
import { Model } from './_model'

export const zContestant = z.object({
    /** UUID */
    id: z.string().uuid(),

    /** */
    gameId: z.string().uuid(),

    /** The contestants name. */
    name: z.string(),

    /** */
    createdAt: z.date(),

    /** */
    updatedAt: z.date(),
})

export type Contestant = z.infer<typeof zContestant>

export const zContestantCreate = z.object({
    gameId: z.string().uuid(),
    name: z.string(),
})

export type ContestantCreate = z.infer<typeof zContestantCreate>

class ContestantModel implements Model<Contestant, ContestantCreate> {
    readonly TableName = 'contestant' as const

    /**
     *
     */
    insert = async (input: ContestantCreate): Promise<Contestant | null> => {
        if (zContestantCreate.safeParse(input).error) {
            console.log(
                'Contestant insert input malformed.',
                JSON.stringify(input)
            )
            return null
        }

        const uuid = v4()
        const insertResult = await jeopardyQuery(SQL`
            INSERT INTO ${this.TableName}
                (id, gameId, name)
            VALUES
                (${uuid}, ${input.gameId}, ${input.name});
        `)

        if ('error' in insertResult) {
            sqlError('Error inserting new contestant.', insertResult.error)
            return null
        }

        return await this.fetchById(uuid)
    }

    /**
     *
     */
    fetchById = async (id: string): Promise<Contestant> => {
        throw new Error('Not implemented')
    }
}

export const contestantModel = new ContestantModel()
