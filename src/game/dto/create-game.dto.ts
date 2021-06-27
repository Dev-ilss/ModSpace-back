import { PartialType } from '@nestjs/swagger';

export class CreateGameDto {}

export class UpdateGameDto extends PartialType(CreateGameDto) {}
