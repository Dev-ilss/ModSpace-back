import { registerAs } from '@nestjs/config';

export default registerAs('config', () => {
  return {
    database: {
      name: process.env.TYPEORM_DATABASE,
      port: process.env.TYPEORM_PORT
    },
    postgres: {
      dbName: process.env.TYPEORM_DATABASE,
      port: parseInt(process.env.TYPEORM_PORT, 10),
      password: process.env.TYPEORM_PASSWORD,
      user: process.env.TYPEORM_USERNAME,
      host: process.env.TYPEORM_HOST
    },
    apiKey: process.env.API_KEY
  };
});
