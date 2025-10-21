import { Module } from '@nestjs/common';
import { UsuariosAutenticacionController } from './usuarios-autenticacion.controller';
import { NatsModule } from 'src/transports/nats.module';

@Module({
  controllers: [UsuariosAutenticacionController],
  providers: [],
  imports: [
    NatsModule
  ]
})
export class UsuariosAutenticacionModule {}
