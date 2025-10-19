import { Module } from '@nestjs/common';
import { DescripcionesImagenesController } from './descripciones-imagenes.controller';
import { NatsModule } from 'src/transports/nats.module';

@Module({
  controllers: [DescripcionesImagenesController],
  providers: [],
  imports: [
    NatsModule
  ]
})
export class DescripcionesImagenesModule {}
