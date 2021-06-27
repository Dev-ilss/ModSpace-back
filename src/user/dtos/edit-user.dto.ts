import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from '.';
import { OmitType } from '@nestjs/swagger';

export class EditUserDto extends PartialType(OmitType(CreateUserDto, ['roles'] as const)) {}
