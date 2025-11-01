import { Controller, Get, Post, Body, Patch, Param, Delete, Inject, ParseIntPipe } from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { NATS_SERVICE } from 'src/config';
import { PuntajeDto } from './dto/puntaje.dto';
import { SesionPuntajeDto } from './dto/sesion.puntaje.dto';
import { catchError } from 'rxjs';

@Controller('alertas-reportes')
export class AlertasReportesController {
  constructor(@Inject(NATS_SERVICE) private readonly client: ClientProxy) {}

  @Post('alertaPuntaje')
  crearAlertaPuntaje(@Body() puntajeDto: PuntajeDto) {
    return this.client.send({cmd:'alertasEvaluarPuntaje'},puntajeDto)
  }

  @Post('reporteTiempo/:idPaciente')
  crearReporte(@Param('idPaciente', ParseIntPipe) idPaciente: number){
    return this.client.send({cmd:'reporteTiempo'}, {idPaciente}).
    pipe(catchError(err => {
      throw new RpcException(err);
    }))
  }
}
