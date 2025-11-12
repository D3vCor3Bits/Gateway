import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { envs } from './config';
import { Logger, RequestMethod, ValidationPipe } from '@nestjs/common';
import * as dotenv from 'dotenv';
import * as promClient from 'prom-client';

dotenv.config();

async function bootstrap() {
  const logger = new Logger('Usuarios-Auth-MS');
  // Crear aplicación HTTP
  const app = await NestFactory.create(AppModule);

  // ===== PROMETHEUS METRICS =====
  const register = new promClient.Registry();
  
  // Métricas por defecto (CPU, Memoria, etc.)
  promClient.collectDefaultMetrics({ register });

  // Métricas custom
  const httpRequestDuration = new promClient.Histogram({
    name: 'http_request_duration_seconds',
    help: 'Duration of HTTP requests in seconds',
    labelNames: ['method', 'route', 'status_code'],
    registers: [register],
  });

  const httpRequestTotal = new promClient.Counter({
    name: 'http_requests_total',
    help: 'Total number of HTTP requests',
    labelNames: ['method', 'route', 'status_code'],
    registers: [register],
  });

  // Endpoint para Prometheus
  app.use('/metrics', async (req, res) => {
    res.setHeader('Content-Type', register.contentType);
    res.send(await register.metrics());
  });

  // Middleware para medir requests
  app.use((req, res, next) => {
    const start = Date.now();
    res.on('finish', () => {
      const duration = (Date.now() - start) / 1000;
      httpRequestDuration.observe(
        { method: req.method, route: req.path, status_code: res.statusCode },
        duration
      );
      httpRequestTotal.inc({
        method: req.method,
        route: req.path,
        status_code: res.statusCode,
      });
    });
    next();
  });
  // ===== END PROMETHEUS =====

  // Habilitar CORS
  app.enableCors({
    origin: '*', // Permite cualquier origen (frontend puede llamar desde cualquier dominio)
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    credentials: false,
    allowedHeaders: 
    ['Content-Type', 'Authorization', 'Accept'],
  });
  app.setGlobalPrefix('api', {
    exclude:[{
      path: '',
      method: RequestMethod.GET
    }]
  });
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
  console.log('HealthCheck added')

  logger.log(`HTTP Server en http://localhost:${envs.port || 3000}`);
  logger.log(` NATS conectado`);
}
bootstrap();
