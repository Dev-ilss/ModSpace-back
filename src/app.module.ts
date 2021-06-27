import { roles } from './app.roles';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
import { AccessControlModule } from 'nest-access-control';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import * as Joi from '@hapi/joi';
import config from './config/database.config';
import { Module, CacheModule, CacheInterceptor } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MulterModule } from '@nestjs/platform-express';
import { UPLOAD_IMAGE } from '@config/constants.config';
import { GameModule } from './game/game.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [config],
      envFilePath: `.env.${process.env.NODE_ENV || 'development'}`, // .env.development
      validationSchema: Joi.object({
        NODE_ENV: Joi.string().valid('development', 'production').default('development')
      })
    }),
    AccessControlModule.forRoles(roles),
    DatabaseModule,
    AuthModule,
    UserModule,
    CacheModule.register(),
    MulterModule.registerAsync({
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => ({
        dest: config.get<string>(UPLOAD_IMAGE)
      })
    }),
    GameModule
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_INTERCEPTOR,
      useClass: CacheInterceptor
    }
  ]
})
export class AppModule {}
