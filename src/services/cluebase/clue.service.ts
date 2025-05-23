import { HttpException, HttpStatus } from '@nestjs/common';
import axios, { AxiosResponse } from 'axios';
import { Clue, ClueData, ClueResponse, GameData, GameResponse } from './cluebase';
import { cluebaseApiService } from './cluebase-api';
import { gameFetcher } from './game.service';

class ClueFetcher {
    private readonly DEFAULT_CLUE_VALUE = 200 as const;

    public async getClue(): Promise<Clue> {
        const clue = await this.fetchRandomClue();
        const game = await gameFetcher.fetchGameById(clue.game_id);
        const { answer, normalizedAnswer } = this.sanitizeApiResponse(clue);

        return {
            answer,
            normalizedAnswer,
            clue: clue.clue,
            value: clue.value ?? this.DEFAULT_CLUE_VALUE,
            category: clue.category,
            airdate: game.air_date,
        }
    }

    private async fetchRandomClue(): Promise<ClueData> {
        const clueResponse = await axios<null, AxiosResponse<ClueResponse, null>>({
            method: 'GET',
            url: `${cluebaseApiService.CLUEBASE_URL}/clues/random`,
        });

        if (clueResponse.data.status === 'success') {
            const clueData = clueResponse.data.data[0];
            if (this.isInvalidClue(clueData.clue, clueData.category, clueData.response)) {
                console.log("Bad clue", clueData);
                return await this.fetchRandomClue();
            }

            return clueData;
        } else {
            throw new HttpException('Internal Server Error', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }



    private sanitizeApiResponse(clue: ClueData): { answer: string, normalizedAnswer: string } {
        // clean up html elements
        const answer = clue.response.replace(/<(?:.|\n)*?>/gm, "");
        // normalize answer for matching
        const normalizedAnswer = answer.replace(/[^a-zA-Z0-9() ]/g, "").toLowerCase();

        return { answer, normalizedAnswer };
    }

    private isInvalidClue(clue: string, category: string, response: string): boolean {
        return !clue
            || !category
            || clue == "null"
            || clue.trim() == ""
            || clue == "="
            || clue.includes("video clue")
            || clue.includes("audio clue")
            || clue.includes("seen here")
            || response.includes("----")
            || response == "="
    }
}

export const clueFetcher: ClueFetcher = new ClueFetcher();