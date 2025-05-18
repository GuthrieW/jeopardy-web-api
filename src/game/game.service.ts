import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { clueFetcher } from "src/cluebase/clue-fetcher";
import { Clue } from "src/cluebase/cluebase";

@Injectable()
export class GameService {
    async fetchClue(): Promise<Clue> {
        const clue = await clueFetcher.getClue();
        if (!clue) {
            throw new HttpException('Internal Server Error', HttpStatus.INTERNAL_SERVER_ERROR);
        }

        return clue;
    }
}