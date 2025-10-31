import { Module } from '@nestjs/common';
import { AlertasReportesController } from './alertas-reportes.controller';
import { NatsModule } from 'src/transports/nats.module';

@Module({
  controllers: [AlertasReportesController],
  providers: [],
  imports: [
    NatsModule
  ]
})
export class AlertasReportesModule {}
