import { Module } from '@nestjs/common';
import { DescripcionesImagenesModule } from './descripciones-imagenes/descripciones-imagenes.module';
import { UsuariosAutenticacionModule } from './usuarios-autenticacion/usuarios-autenticacion.module';
import { AlertasReportesModule } from './alertas-reportes/alertas-reportes.module';
import { HealthCheckModule } from './health-check/health-check.module';


@Module({
  imports: [DescripcionesImagenesModule, UsuariosAutenticacionModule, AlertasReportesModule, HealthCheckModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
