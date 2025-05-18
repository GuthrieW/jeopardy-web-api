import { Controller, HttpException, HttpStatus, Post } from "@nestjs/common";
import { GameService } from "./game.service";
import { ApiResponse } from "src/api";
import { Clue } from "src/cluebase/cluebase";

@Controller()
export class GameController {

    constructor(private readonly gameService: GameService) { }

    @Post('/clue')
    async answer(): Promise<ApiResponse<Clue>> {
        return {
            status: 'success',
            payload: await this.gameService.fetchClue()
        }
    }

    @Post('/clue/:id/answer')
    question(): ApiResponse<null> {
        return {
            status: 'error',
            message: 'not implemented',
        };
    }
}