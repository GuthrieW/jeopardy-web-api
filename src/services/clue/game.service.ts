import axios, { AxiosResponse } from "axios";
import { clueApiService } from "./clue-api";
import { GameData, GameResponse } from "./clue-api.d";

class GameService {
    async fetchGameById(gameId: number): Promise<GameData> {
        const gameResponse = await axios<null, AxiosResponse<GameResponse, null>>({
            method: "GET",
            url: `${clueApiService.CLUE_API_URL}/games/${gameId}`,
        });

        if (gameResponse.data.status === 'success') {
            return gameResponse.data.data[0];
        } else {
            throw new Error(`Game #${gameId} not found in Cluebase API`);
        }

    }
}

export const gameService: GameService = new GameService()