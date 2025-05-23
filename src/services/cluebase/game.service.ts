import axios, { AxiosResponse } from "axios";
import { cluebaseApiService } from "./cluebase-api";
import { GameData, GameResponse } from "./cluebase";
import { HttpException, HttpStatus } from "@nestjs/common";

class GameFetcher {
    async fetchGameById(gameId: number): Promise<GameData> {
        const gameResponse = await axios<null, AxiosResponse<GameResponse, null>>({
            method: "GET",
            url: `${cluebaseApiService.CLUEBASE_URL}/games/${gameId}`,
        });

        if (gameResponse.data.status === 'success') {
            return gameResponse.data.data[0];
        } else {
            throw new HttpException('Internal Server Error', HttpStatus.INTERNAL_SERVER_ERROR);
        }

    }
}

export const gameFetcher: GameFetcher = new GameFetcher()