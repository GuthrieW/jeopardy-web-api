import { jeopardyQuery } from 'src/database/database'
import SQL from 'sql-template-strings'
import { v4 } from 'uuid'
import sqlError from 'src/utils/sql-error'
import { z } from 'zod'
import { Model } from './_model'

export const zGame = z.object({
    /** UUID */
    id: z.string().uuid(),

    /** */
    name: z.string(),

    /** The number of seconds contestants have to answer a question. Defaults to 0. 0 means there is no time limit. */
    speed: z.number(),

    /** If the game is in infinite mode. Infinite mode will send a new clue once the current clue is answered correctly. */
    isInfinteMode: z.boolean(),

    /** */
    createdAt: z.date(),

    /** */
    updatedAt: z.date(),
})

export type Game = z.infer<typeof zGame>

export const zGameCreate = z.object({
    name: z.string(),
})

export type GameCreate = z.infer<typeof zGameCreate>

class GameModel implements Model<Game, GameCreate> {
    readonly TableName = 'game' as const

    /** */
    readonly DEFAULT_SPEED = 1 as const

    /** */
    readonly DEFAULT_MINIMUM_GAME_SPEED = 1 as const

    /** */
    readonly DEFAULT_MAXIMUM_GAME_SPEED = 1 as const

    /** */
    readonly DEFAULT_INFINITE = 0 as const

    /**
     *
     */
    insert = async (input: GameCreate): Promise<Game | null> => {
        if (zGameCreate.safeParse(input).error) {
            console.log('Game insert input malformed.', JSON.stringify(input))
            return null
        }

        const uuid = v4()
        const insertResult = await jeopardyQuery(SQL`
            INSERT INTO ${this.TableName}
                (id, name)
            VALUES
                (${uuid}, ${input.name});
        `)

        if ('error' in insertResult) {
            sqlError('Error inserting new game.', insertResult.error)
            return null
        }

        return await this.fetchById(uuid)
    }

    fetchById = async (id: string): Promise<Game> => {
        throw new Error('Not implemented')
    }

    /**
     *
     */
    updateSpeed = async (
        newSpeed: number,
        gameId: string
    ): Promise<boolean> => {
        const updateResult = await jeopardyQuery(SQL`
            UPDATE ${gameModel.TableName}
            SET speed=${newSpeed}
            WHERE id=${gameId};
        `)

        if ('error' in updateResult) {
            sqlError(
                `Error updating speed setting. Game ID: ${gameId}. New Speed Setting: ${newSpeed}.`,
                updateResult.error
            )
            return false
        }

        return true
    }

    /**
     *
     */
    updateInfinite = async (
        infinite: number,
        gameId: string
    ): Promise<boolean> => {
        const updateResult = await jeopardyQuery(SQL`
            UPDATE game
            SET infinite=${infinite}
            WHERE id=${gameId};
        `)

        if ('error' in updateResult) {
            sqlError(
                `Error updating infinite setting. Game ID: ${gameId}. New Infinite Setting: ${infinite}`,
                updateResult.error
            )
            return false
        }

        return true
    }
}

export const gameModel = new GameModel()
