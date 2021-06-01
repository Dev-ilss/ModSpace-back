import { PORT } from './config';
import { ConfigService } from '@nestjs/config';
import { initSwagger } from './app.swagger';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import * as compression from 'compression';
import * as helmet from 'helmet';
import * as csurf from 'csurf';
import * as rateLimit from 'express-rate-limit';
/**
 * @author Raul E. Aguirre H.
 * @ysp0lur
 * @description Configuraciones globales de la aplicación
 */
async function bootstrap() {
  const app: NestExpressApplication = await NestFactory.create(AppModule, {
    logger: ['log', 'error', 'warn'],
  });

  /**
   * Variables de Entorno
   * @description Solo Usar constantes
   */
  const config = app.get(ConfigService);
  /**
   * Inicia Swagger(Documentador)
   */
  initSwagger(app);
  /**
   * Prefijo para todos los controladores
   */
  app.setGlobalPrefix('api/v1');
  /**
   * Habilita compresión gzip para toda petición
   */
  app.use(compression());
  /**
   * Habilita Origenes cruzados
   */
  app.enableCors();
  /**
   * Habilita configuración adecuada de encabezados http
   */
  app.use(helmet());
  /**
   * Previne falsificación de solicitudes entre sitios
   */
  // app.use(csurf()); // TODO: Necesita configuración de session
  /**
   * Ayuda a prevención de los ataques de fuerza bruta
   */
  app.use(
    rateLimit({
      windowMs: 15 * 60 * 1000, // 15 minutes // TODO: Cambiar a constantes
      max: 100, // limit each IP to 100 requests per windowMs
    }),
  );
  /**
   * Manejo del almacenamiento y resaltado de logs
   */
  const logger = new Logger('Init');
  /**
   * Manejo de archivos estaticos(Solo Swagger)
   */
  app.useStaticAssets(join(__dirname, '..', 'public'));
  /**
   * Guardas globales
   */
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      // disableErrorMessages: true,
    }),
  );

  await app.listen(parseInt(config.get<string>(PORT), 10) || 4000, '0.0.0.0');
  
  logger.log(`Dev-ilss Group Server is running in ${ await app.getUrl()}`);
}
bootstrap();
