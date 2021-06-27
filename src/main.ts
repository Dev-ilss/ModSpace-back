import { PORT } from './config';
import { ConfigService } from '@nestjs/config';
import { initSwagger } from './app.swagger';
import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { ClassSerializerInterceptor, Logger, ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import path, { join } from 'path';
import * as compression from 'compression';
import * as helmet from 'helmet';
import * as csurf from 'csurf';
import * as rateLimit from 'express-rate-limit';
import * as fs from 'fs';
/**
 * @author Raul E. Aguirre H.
 * @ysp0lur
 * @description Configuraciones globales de la aplicación
 */
async function bootstrap() {
  // Certificado SSL
  const ssl = process.env.SSL === 'true' ? true : false;
  let httpsOptions = null;
  if (ssl) {
    const keyPath = process.env.SSL_KEY_PATH || '';
    const certPath = process.env.SSL_CERT_PATH || '';
    httpsOptions = {
      key: fs.readFileSync(path.join(__dirname, keyPath)), // __dirname es opcional, si no esta en el directorio del proyecto quitarlo y poner ruta absoluta
      cert: fs.readFileSync(path.join(__dirname, certPath)) // mismo caso que en key
    };
  }

  const app: NestExpressApplication = await NestFactory.create(AppModule, {
    logger: ['log', 'error', 'warn']
  });

  /**
   * Variables de Entorno
   * @description
   */
  const config = app.get(ConfigService);
  const port = Number(config.get<string>(PORT)) || 4000;
  const hostname = process.env.HOSTNAME || '0.0.0.0';
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
      max: 100 // limit each IP to 100 requests per windowMs
    })
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
      transformOptions: {
        enableImplicitConversion: true
      }
    })
  );
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));

  // Server
  await app.listen(port, hostname, () => {
    const address = `http${ssl ? 's' : ''}://${hostname}:${port}`;
    logger.log(`Dev-ilss Group Server is running in  ${address}`);
  });
}
bootstrap();
