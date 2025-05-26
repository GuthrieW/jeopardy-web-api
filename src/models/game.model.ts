import { jeopardyQuery } from "src/database/database";
import SQL from "sql-template-strings";
import { v4 } from "uuid";

export type Game = {
    /** */
    readonly id: string

    /** */
    readonly speed: number

    /** */
    readonly infinite: boolean

}

class GameModel {
    /** */
    readonly DEFAULT_SPEED = 1 as const;

    /** */
    readonly DEFAULT_MINIMUM_GAME_SPEED = 1 as const;

    /** */
    readonly DEFAULT_MAXIMUM_GAME_SPEED = 1 as const;

    /** */
    readonly DEFAULT_INFINITE = 0 as const;

    /** */
    readonly TABLE_NAME = 'game' as const;

    /** */
    insert = async (): Promise<boolean> => {
        const uuid = v4();

        const insertResult = await jeopardyQuery(SQL`
            INSERT INTO ${this.TABLE_NAME}
                (id, speed, infinite)
            VALUES
                (${uuid}, ${this.DEFAULT_SPEED}, ${this.DEFAULT_INFINITE});
        `);

        return !('error' in insertResult);
    }

    updateSpeed = async (newSpeed: number, gameId: string): Promise<boolean> => {
        const updateResult = await jeopardyQuery(SQL`
            UPDATE ${gameModel.TABLE_NAME}
            SET speed=${newSpeed}
            WHERE id=${gameId};
        `);

        if ('error' in updateResult) {
            console.error(`Error updating speed setting. Game ID: ${gameId}. New Speed Setting: ${newSpeed}.\n${JSON.stringify(updateResult.error)}`);
            return false;
        }

        return true;
    }


    updateInfinite = async (infinite: number, gameId: string): Promise<boolean> => {
        const updateResult = await jeopardyQuery(SQL`
            UPDATE game
            SET infinite=${infinite}
            WHERE id=${gameId};
        `);

        if ('error' in updateResult) {
            console.error(`Error updating infinite setting. Game ID: ${gameId}. New Infinite Setting: ${infinite}.\n${JSON.stringify(updateResult.error)}`);
            return false;
        }

        return true;
    }

}

export const gameModel = new GameModel()