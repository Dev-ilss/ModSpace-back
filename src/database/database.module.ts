import { Module, Global } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { Client } from 'pg';
import { TypeOrmModule } from '@nestjs/typeorm';

import config from '../config/database.config';
import { join } from 'path';

const API_KEY = '12345634';
const API_KEY_PROD = 'PROD1212121SA';

@Global()
@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      inject: [config.KEY],
      useFactory: (configService: ConfigType<typeof config>) => {
        const { user, host, dbName, password, port } = configService.postgres;
        return {
          type: 'postgres',
          host,
          port,
          username: user,
          password,
          database: dbName,
          autoLoadEntities: true,
          migrationsRun: false,
          migrations: [join(__dirname, '../database/migration/**/*{.ts,.js}')],
          migrationsTableName: 'migrations',
          entities: [join(__dirname, '../**/**/*.entity{.ts,.js}')],
          extra: {
            connectionLimit: parseInt(process.env.DB_CONNECTIONLIMIT),
            connectTimeout: parseInt(process.env.DB_CONNECTTIMEOUT)
          },
          cli: {
            migrationsDir: 'src/database/migration',
            entitiesDir: 'src/entities',
            subscribersDir: 'src/subscribers'
          },
          // Activar SOLO MANUALMENTE en DESARROLLO SI ES NECESARIO (DESACTIVAR EN PRODUCCION).
          synchronize: false,
          logging: true,
          logger: 'file'
        };
      }
    })
  ],
  providers: [
    {
      provide: 'API_KEY',
      useValue: process.env.NODE_ENV === 'production' ? API_KEY_PROD : API_KEY
    },
    {
      provide: 'PG',
      useFactory: (configService: ConfigType<typeof config>) => {
        const { user, host, dbName, password, port } = configService.postgres;
        const client = new Client({
          user,
          host,
          database: dbName,
          password,
          port
        });
        client.connect();
        return client;
      },
      inject: [config.KEY]
    }
  ],
  exports: ['API_KEY', 'PG', TypeOrmModule]
})
export class DatabaseModule {}
