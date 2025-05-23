import { Controller, HttpException, HttpStatus, Post } from "@nestjs/common";
import { ApiResponse } from "src/api";

@Controller()
export class SettingsController {
    constructor() { }

    @Post()
    async gameSpeed(): Promise<ApiResponse<void>> {
        throw new HttpException("Not implemented", HttpStatus.INTERNAL_SERVER_ERROR);
    }

    @Post()
    async infiniteMode(): Promise<ApiResponse<void>> {
        throw new HttpException("Not implemented", HttpStatus.INTERNAL_SERVER_ERROR);
    }
}