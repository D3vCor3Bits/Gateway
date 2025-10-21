import { Module } from '@nestjs/common';
import { DescripcionesImagenesModule } from './descripciones-imagenes/descripciones-imagenes.module';
import { UsuariosAutenticacionModule } from './usuarios-autenticacion/usuarios-autenticacion.module';

@Module({
  imports: [DescripcionesImagenesModule, UsuariosAutenticacionModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
