import { NestFactory } from '@nestjs/core';
import { Logger, ValidationPipe } from '@nestjs/common';
import {SwaggerModule, DocumentBuilder} from '@nestjs/swagger';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import { BackendEnvs, FrontEnvs } from './config/envs';

async function main() {
  const app = await NestFactory.create(AppModule);
  const logger = new Logger('Backend Prueba');
  app.setGlobalPrefix('api');
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Automatically remove properties that are not in the DTO
      forbidNonWhitelisted: true, // Throw an error if non-whitelisted properties are found
    }),
  );
  if (BackendEnvs.environment === 'dev') {
    //Configuración swagger (Documentación de las APIS)
    const config = new DocumentBuilder()
      .setTitle('API DOCUMENTATION')
      .setDescription('Documentation of the Backend Prueba')
      .setVersion('1.0')
      .addBearerAuth(
        {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          name: 'Authorization',
          description: 'Ingrese el token JWT de acceso',
          in: 'header',
        },
        'access-token',
      )
      .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, document);
  }
  app.enableCors({
    origin: FrontEnvs.frontendServers,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders: ['Content-Type', 'Authorization', 'credentials'],
    credentials: true,
  });
  app.use(cookieParser());
  const port = BackendEnvs.port ?? 3000;
  logger.log(`Server running at ${BackendEnvs.url}/api`);
  await app.listen(port);
}
main();