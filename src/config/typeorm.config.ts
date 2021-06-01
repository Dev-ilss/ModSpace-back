import { TypeOrmModuleOptions } from "@nestjs/typeorm";

export const typeOrm: TypeOrmModuleOptions = {
    type: 'mysql',
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    autoLoadEntities: true,
    synchronize: true,
    logging: process.env.DB_LOGGING == 'true',
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
            connectionLimit: parseInt(process.env.DB_CONNECTIONLIMIT),
            connectTimeout: parseInt(process.env.DB_CONNECTTIMEOUT)
        },
    cli: {
            entitiesDir: 'dist/entities',
            migrationsDir: 'dist/migrations',
            subscribersDir: 'dist/subscribers'
        }
}