import { Controller, Get, HttpException, HttpStatus } from "@nestjs/common";
import { ApiResponse } from "src/api";

@Controller()
export class StatisticsController {
    constructor() { }

    @Get('statistics/leaderboard/:id')
    async leaderboard(): Promise<ApiResponse<void>> {
        throw new HttpException("Not implemented", HttpStatus.INTERNAL_SERVER_ERROR);
    }
}