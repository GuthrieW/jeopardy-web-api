import { HttpException, HttpStatus } from '@nestjs/common';
import axios, { AxiosResponse } from 'axios';
import { Clue, ClueData, ClueResponse, GameData, GameResponse } from './cluebase';

class ClueFetcher {
    private readonly CLUEBASE_URL = "http://cluebase.lukelav.in" as const;

    public async getClue(): Promise<Clue> {
        const clue = await this.fetchRandomClue();
        const game = await this.fetchGameById(clue.game_id);
        const { answer, normalizedAnswer } = this.sanitizeApiResponse(clue);

        return {
            answer,
            normalizedAnswer,
            clue: clue.clue,
            value: clue.value ?? 200,
            category: clue.category,
            airdate: game.air_date,
        }
    }

    private async fetchRandomClue(): Promise<ClueData> {
        const clueResponse = await axios<null, AxiosResponse<ClueResponse, null>>({
            method: 'GET',
            url: `${this.CLUEBASE_URL}/clues/random`,
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

    private async fetchGameById(gameId: number): Promise<GameData> {
        const gameResponse = await axios<null, AxiosResponse<GameResponse, null>>({
            method: "GET",
            url: `${this.CLUEBASE_URL}/games/${gameId}`,
        });

        if (gameResponse.data.status === 'success') {
            return gameResponse.data.data[0];
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