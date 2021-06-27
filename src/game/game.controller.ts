import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpStatus,
  HttpException,
  Put,
  Request
} from '@nestjs/common';
import { GameService } from './game.service';
import { CreateGameDto, UpdateGameDto } from './dto/create-game.dto';
import { Auth } from '@common/decorators';
import { ApiTags } from '@nestjs/swagger';
import { InjectRolesBuilder, RolesBuilder } from 'nest-access-control';
import { AppResource } from '@src/app.roles';
import { classToPlain } from 'class-transformer';
import { ParseIntPipe } from '@common/pipes/parse-int.pipe';

@ApiTags('Games')
@Controller('games')
export class GameController {
  constructor(
    private readonly gameService: GameService,
    @InjectRolesBuilder()
    private readonly rolesBuilder: RolesBuilder
  ) {}

  @Auth({
    possession: 'any',
    action: 'read',
    resource: AppResource.GAME
  })
  @Get()
  async findAllGamesAdmin() {
    const data = await this.gameService.findAll();
    return {
      error: false,
      data: classToPlain(data),
      message: 'My Games'
    };
  }

  /**
   * @description Obtiene Todos los Certificados
   * @param req
   */
  @Auth({
    possession: 'own',
    action: 'read',
    resource: AppResource.GAME
  })
  @Get('my-games')
  async getAllGames(@Request() req) {
    const { id } = req.user;
    const data = await this.gameService.findAllMyGames(id);
    return {
      error: false,
      data: classToPlain(data),
      message: 'My Games'
    };
  }

  @Auth({
    possession: 'any',
    action: 'read',
    resource: AppResource.GAME
  })
  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const data = await this.gameService.findOne(id);
    return {
      error: false,
      data: classToPlain(data),
      message: data.title
    };
  }

  @Auth({
    possession: 'own',
    action: 'read',
    resource: AppResource.GAME
  })
  @Get('my-game/:id')
  async findOneGame(@Param('id', ParseIntPipe) gameId: number, @Request() req) {
    const { id } = req.user;
    const data = await this.gameService.findOneGame(gameId, id);
    return {
      error: false,
      data: classToPlain(data),
      message: data.title
    };
  }

  @Auth({
    possession: 'own',
    action: 'create',
    resource: AppResource.GAME
  })
  @Post()
  async create(@Body() createGameDto: CreateGameDto, @Request() req) {
    const { id } = req.user;
    const data = await this.gameService.create(createGameDto, id).catch((err) => {
      throw new HttpException(
        {
          error: true,
          data: null,
          message: err.detail
        },
        HttpStatus.BAD_REQUEST
      );
    });
    return {
      error: false,
      data: classToPlain(data),
      message: 'Game Created'
    };
  }

  @Auth({
    possession: 'own',
    action: 'update',
    resource: AppResource.GAME
  })
  @Put(':id')
  async update(@Param('id', ParseIntPipe) gameId: number, @Body() updateGameDto: UpdateGameDto, @Request() req) {
    const { id } = req.user;
    const data = await this.gameService.update(gameId, updateGameDto, id);
    return {
      error: false,
      data: classToPlain(data),
      message: 'Game Updated'
    };
  }

  @Auth({
    possession: 'own',
    action: 'delete',
    resource: AppResource.GAME
  })
  @Delete(':id')
  async deleteUser(@Param('id') id: number): Promise<any> {
    const data = await this.gameService.remove(id);
    return {
      error: false,
      data: classToPlain(data),
      message: 'Game deleted'
    };
  }

  @Auth({
    possession: 'any',
    action: 'create',
    resource: AppResource.GAME
  })
  @Patch('recover/:id')
  async recover(@Param('id', ParseIntPipe) id: number) {
    const data = await this.gameService.recover(id);
    return {
      error: false,
      data: classToPlain(data),
      message: 'Game Recovered'
    };
  }
}
