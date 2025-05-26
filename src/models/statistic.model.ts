import { v4 } from "uuid";
import { jeopardyQuery } from "src/database/database";
import SQL from "sql-template-strings";

export type Statistic = {
    /** */
    readonly id: string

    /** */
    readonly gameId: string

    /** */
    readonly contestantId: string

    /** */
    readonly score: number

    /** */
    readonly totalAnswers: number

    /** */
    readonly correctAnswers: number

    /** */
    readonly incorrectAnswers: number
}

class StatisticModel {
    /** */
    readonly TABLE_NAME = 'statistic' as const;

    /** */
    insert = async (input: Statistic) => {
        const uuid = v4();

        const insertResult = await jeopardyQuery(SQL`
            INSERT INTO ${this.TABLE_NAME}
                (id, gameId, contestantId, score, totalAnswers, correctAnswers, incorrectAnswers)
            VALUES
                (${uuid}, ${input.gameId}, ${input.contestantId}, ${input.score}, ${input.totalAnswers}, ${input.correctAnswers}, ${input.incorrectAnswers});
        `);

        return !('error' in insertResult);
    };
}

export const statisticModel = new StatisticModel();