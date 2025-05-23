import { Controller, HttpException, HttpStatus, Post } from "@nestjs/common";
import { ApiResponse } from "src/api";
import { clueFetcher } from "src/services/cluebase/clue.service";
import { Clue } from "src/services/cluebase/cluebase";

@Controller()
export class GameController {
    constructor() { }

    @Post('/game/clue')
    async answer(): Promise<ApiResponse<Clue>> {
        const clue = await clueFetcher.getClue();

        if (!clue) {
            throw new HttpException("Not implemented", HttpStatus.INTERNAL_SERVER_ERROR);
        }

        return {
            status: 'success',
            payload: clue,
        }
    }

    @Post('/game/clue/:id')
    question(): ApiResponse<null> {
        return {
            status: 'error',
            message: 'not implemented',
        };
    }
}