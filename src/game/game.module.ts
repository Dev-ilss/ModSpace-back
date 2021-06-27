import { UserEntity } from '@src/user/entities';
import { GameEntity } from './entities/game.entity';
import { Module } from '@nestjs/common';
import { GameService } from './game.service';
import { GameController } from './game.controller';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([GameEntity, UserEntity])],
  controllers: [GameController],
  providers: [GameService],
  exports: [GameService]
})
export class GameModule {}
