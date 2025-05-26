import { v4 } from "uuid";
import { jeopardyQuery } from "src/database/database";
import SQL from "sql-template-strings";

export type Answer = {
    /** */
    readonly id: string

    /** */
    readonly gameId: string

    /** */
    readonly contestantId: string

    /** */
    readonly questionId: string

    /** */
    readonly text: string

    /** */
    readonly correct: boolean
}

class AnswerModel {
    /** */
    readonly TABLE_NAME: 'answer';

    public insert = async (input: Answer): Promise<boolean> => {
        const uuid = v4();
        const insertResult = await jeopardyQuery(SQL`
            INSERT INTO ${this.TABLE_NAME}
                (id, gameId, contestantId, questionId, text, correct)
            VALUES
                (${uuid}, ${input.gameId}, ${input.contestantId}, ${input.questionId}, ${input.text}, ${input.correct});
        `)

        return !('error' in insertResult);
    }
}

export const answerModel = new AnswerModel();