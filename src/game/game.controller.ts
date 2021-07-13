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
  Request,
  UploadedFile,
  UseInterceptors,
  Res
} from '@nestjs/common';
import { GameService } from './game.service';
import { CreateGameDto, UpdateGameDto } from './dto/create-game.dto';
import { Auth } from '@common/decorators';
import { ApiBody, ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';
import { InjectRolesBuilder, RolesBuilder } from 'nest-access-control';
import { AppResource } from '@src/app.roles';
import { classToPlain } from 'class-transformer';
import { ParseIntPipe } from '@common/pipes/parse-int.pipe';
import { FileInterceptor } from '@nestjs/platform-express';
import { optionsUploadImage } from '@config/multer.config';

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
  @ApiOperation({ summary: 'Administration' })
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
  @ApiOperation({ summary: 'Administration' })
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
    action: 'read',
    resource: AppResource.GAME
  })
  @Get('picture/:imageId')
  async serveImage(@Param('imageId') imageId: string, @Res() res): Promise<any> {
    res.sendFile(imageId, { root: 'uploads/images'});
  }

  @Auth({
    possession: 'own',
    action: 'create',
    resource: AppResource.GAME
  })
  @Post()
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        title: { type: 'string' },
        description: { type: 'integer' },
        image: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @UseInterceptors(FileInterceptor('image', optionsUploadImage))
  async create(@Request() req, @UploadedFile() file: Express.Multer.File) {
    const { id } = req.user;
    const createGameDto: CreateGameDto = {
      title: req.body.title,
      description: req.body.description,
      imageName: file.originalname,
      imagePath: file.filename
    }
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
  @ApiOperation({ summary: 'Administration' })
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
  @ApiOperation({ summary: 'Administration' })
  async recover(@Param('id', ParseIntPipe) id: number) {
    const data = await this.gameService.recover(id);
    return {
      error: false,
      data: classToPlain(data),
      message: 'Game Recovered'
    };
  }
}
