import { jeopardyQuery } from 'src/database/database';
import SQL from 'sql-template-strings';
import { v4 } from 'uuid';

export type Clue = {
    /** */
    readonly id: string

    /** */
    readonly answer: string

    /** */
    readonly text: string

    /** */
    readonly value: number

    /** */
    readonly category: string

    /** */
    readonly airdate: string
}

class ClueModel {
    /** */
    readonly TABLE_NAME = 'clue' as const;

    public insert = async (input: Clue) => {
        const uuid = v4();

        const insertResult = await jeopardyQuery(SQL`
            INSERT INTO ${this.TABLE_NAME}
                (id, answer, text, value, category, airdate)
            VALUES
                (${uuid}, ${input.answer}, ${input.text}, ${input.value}, ${input.category}, ${input.airdate});
        `)

        return !('error' in insertResult);
    }
}

export const clueModel = new ClueModel()