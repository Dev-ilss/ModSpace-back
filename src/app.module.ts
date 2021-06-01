import { roles } from './app.roles';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccessControlModule } from 'nest-access-control'
import { APP_INTERCEPTOR } from '@nestjs/core';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { DATABASE_HOST, DATABASE_PORT, DATABASE_USERNAME, DATABASE_PASSWORD, DATABASE_NAME, DATABASE_LOGGING, DATABASE_CONNECTIONLIMIT, DATABASE_CONNECTTIMEOUT, UPLOAD_IMAGE }  from './config';
import { Module, CacheModule, CacheInterceptor } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MulterModule } from '@nestjs/platform-express';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
      type: 'mysql',
      host: config.get<string>(DATABASE_HOST),
      port: parseInt(config.get<string>(DATABASE_PORT)),
      username: config.get<string>(DATABASE_USERNAME),
      password: config.get<string>(DATABASE_PASSWORD),
      database: config.get<string>(DATABASE_NAME),
      autoLoadEntities: true,
      synchronize: true,
      logging: config.get<string>(DATABASE_LOGGING) == 'true',
      logger: 'file',
      entities: [
              __dirname + './**/**/*.entity{.ts,.js}'
          ],
      migrations: [
              __dirname + './**/**/*.migration{.ts,.js}'
          ],
      subscribers: [
              __dirname + './**/**/*.subscriber{.ts,.js}'
          ],
      extra: {
              connectionLimit: parseInt(config.get<string>(DATABASE_CONNECTIONLIMIT)),
              connectTimeout: parseInt(config.get<string>(DATABASE_CONNECTTIMEOUT))
          },
      cli: {
              entitiesDir: 'dist/entities',
              migrationsDir: 'dist/migrations',
              subscribersDir: 'dist/subscribers'
          }
      })
    }),
    ConfigModule.forRoot({
      envFilePath: '.env.development',
      // envFilePath: '.env.production',
      expandVariables: true,
      isGlobal: true,
    }),
    // MulterModule.register({
    //   dest: '/register',
    // }),
    AccessControlModule.forRoles(roles),
    AuthModule,
    UserModule,
    CacheModule.register(),
    MulterModule.registerAsync({
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => ({
        dest: config.get<string>(UPLOAD_IMAGE),
      }),
    }),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_INTERCEPTOR,
      useClass: CacheInterceptor,
    },
  ],
})
export class AppModule {}
