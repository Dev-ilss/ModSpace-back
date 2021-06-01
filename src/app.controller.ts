import { ApiTags } from '@nestjs/swagger';
import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
@ApiTags('Init')
@Controller('/')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
