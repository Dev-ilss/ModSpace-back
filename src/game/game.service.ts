import { UserEntity } from '@src/user/entities';
import { GameEntity } from './entities/game.entity';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateGameDto, UpdateGameDto } from './dto/create-game.dto';

@Injectable()
export class GameService {
  constructor(
    @InjectRepository(GameEntity)
    private readonly gameRepository: Repository<GameEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>
  ) {}

  async create(createGameDto: CreateGameDto, userId: number) {
    const newGame = this.gameRepository.create(createGameDto);
    if (userId) {
      const user = await this.userRepository.findOne(userId);
      newGame.user = user;
    }
    return this.gameRepository.save(newGame);
  }

  async findAll() {
    const game = await this.gameRepository.find({ relations: ['user'] });
    if (game.length == 0) {
      throw new NotFoundException('Game not found');
    }
    return game;
  }

  async findAllMyGames(id: number) {
    const game = await this.gameRepository.find({ where: { user: { id: id } } });
    if (game.length == 0) {
      throw new NotFoundException('Games not found');
    }
    return game;
  }

  async findOne(id: number) {
    const game = await this.gameRepository.findOne(id, { relations: ['user'] });
    if (!game) {
      throw new NotFoundException(`Game #${id} not found`);
    }
    return game;
  }

  async findOneGame(gameId: number, userId: number) {
    const game = await this.gameRepository.findOne(gameId, { where: { user: { id: userId } } });
    if (!game) {
      throw new NotFoundException(`Game #${gameId} not found`);
    }
    return game;
  }

  async update(id: number, updateGameDto: UpdateGameDto, userId: number) {
    const game = await this.gameRepository.findOne(id);
    if (userId) {
      const user = await this.userRepository.findOne(userId);
      game.user = user;
    }
    this.gameRepository.merge(game, updateGameDto);
    return this.gameRepository.save(game);
  }

  async remove(id: number) {
    const game = await this.gameRepository.findOne(id);
    if (!game) {
      throw new NotFoundException('Game not found');
    }
    return this.gameRepository.softRemove(game);
  }

  async recover(id: number) {
    const game = await this.gameRepository.findOne({ where: { id }, withDeleted: true });
    if (!game) {
      throw new NotFoundException('Game not found');
    }
    return this.gameRepository.recover(game);
  }
}
