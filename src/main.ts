import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { envs } from './config';
import { Logger, ValidationPipe } from '@nestjs/common';
import * as dotenv from 'dotenv';

dotenv.config();

async function bootstrap() {
  const logger = new Logger('Usuarios-Auth-MS');
  // Crear aplicación HTTP
  const app = await NestFactory.create(AppModule);

  // Habilitar CORS
  app.enableCors({
    origin: ['http://localhost:3005', 'http://localhost:3006'],
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    credentials: true,
    allowedHeaders: 
    ['Content-Type', 'Authorization', 'Accept'],
  });
  app.setGlobalPrefix('api');
  // Configurar validación global
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    })
  );

  // Conectar microservicio NATS
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.NATS,
    options: {
      servers: envs.natsServers,
    },
  });

  // Iniciar ambos
  await app.startAllMicroservices();
  await app.listen(envs.port || 3000);

  logger.log(`HTTP Server en http://localhost:${envs.port || 3000}`);
  logger.log(` NATS conectado`);
}
bootstrap();
