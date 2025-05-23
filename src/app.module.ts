import { Module } from '@nestjs/common';
import { GameController } from './endpoints/game.controller';

@Module({
  imports: [],
  controllers: [GameController],
  providers: [],
})
export class AppModule { }
