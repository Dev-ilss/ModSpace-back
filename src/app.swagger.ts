import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { INestApplication } from '@nestjs/common';

/**
* Inicia Swagger para la documentación
@author Raul E. Aguirre H.
*@description Debe inyectarse la aplicacion a documentar
*@example initSwagger(app)
*/
export const initSwagger = (app: INestApplication): any => {
  const swaggerConfig = new DocumentBuilder()
    .setTitle('API Documentation')
    .setDescription('API documentation for Dev-ilss platform (Dev-ilss Group)')
    .setVersion('0.1.0')
    .addBearerAuth()
    .addServer('/api/v1') // TODO: Cambiar por constantes
    // .setBasePath('api/v1/')
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig, {
    ignoreGlobalPrefix: false
  });

  SwaggerModule.setup('api/v1/docs', app, document, {
    explorer: true,
    customCss: `
          .topbar-wrapper img {content:url(\'/assets/img/documentationdevils.png\'); width:150px; height:150px;}
          .swagger-ui .topbar { background-color: #85D5FD; }`,
    customSiteTitle: 'Dev-ilss API Documentation',
    customfavIcon: '/assets/img/favicon.png',
    swaggerOptions: {
      filter: true,
      showRequestDuration: true,
      ignoreGlobalPrefix: false
    }
  });
};
