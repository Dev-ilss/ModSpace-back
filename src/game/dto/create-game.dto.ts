import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsNotEmpty, IsPositive, IsString, MaxLength } from 'class-validator';

export class CreateGameDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(80)
  @ApiProperty()
  readonly title: string;

  @IsNotEmpty()
  @ApiProperty()
  readonly description: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(50)
  @ApiProperty()
  readonly imageName: string;
  
  @IsNotEmpty()
  @IsString()
  @MaxLength(250)
  @ApiProperty()
  readonly imagePath: string;
}

export class UpdateGameDto extends PartialType(CreateGameDto) {}
