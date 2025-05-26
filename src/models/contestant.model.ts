import { v4 } from "uuid";
import { jeopardyQuery } from "src/database/database";
import SQL from "sql-template-strings";

export type Contestant = {
    /** */
    readonly id: string

    /** */
    readonly gameId: string

    /** */
    readonly name: string
}

class ContestantModel {
    /** */
    readonly TABLE_NAME = 'contestant' as const;


    /** */
    insert = async (input: Contestant) => {
        const uuid = v4();

        const insertResult = await jeopardyQuery(SQL`
            INSERT INTO ${this.TABLE_NAME}
                (id, gameId, name)
            VALUES
                (${uuid}, ${input.gameId}, ${input.name});
        `);

        return !('error' in insertResult);

    };

}

export const contestantModel = new ContestantModel()