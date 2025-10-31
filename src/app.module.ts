import { Module } from '@nestjs/common';
import { DescripcionesImagenesModule } from './descripciones-imagenes/descripciones-imagenes.module';
import { UsuariosAutenticacionModule } from './usuarios-autenticacion/usuarios-autenticacion.module';
import { AlertasReportesModule } from './alertas-reportes/alertas-reportes.module';


@Module({
  imports: [DescripcionesImagenesModule, UsuariosAutenticacionModule, AlertasReportesModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
