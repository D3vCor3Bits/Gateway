import { Controller, Get, Post, Body, Patch, Param, Delete, Inject } from '@nestjs/common';
import { CreateAlertasReporteDto } from './dto/create-alertas-reporte.dto';
import { UpdateAlertasReporteDto } from './dto/update-alertas-reporte.dto';
import { ClientProxy } from '@nestjs/microservices';
import { NATS_SERVICE } from 'src/config';

@Controller('alertas-reportes')
export class AlertasReportesController {
  constructor(@Inject(NATS_SERVICE) private readonly client: ClientProxy) {}

  @Post()
  create(@Body() createAlertasReporteDto: CreateAlertasReporteDto) {
    return this.client.send('createAlertasReporte',{})
  }

  @Get()
  findAll() {
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAlertasReporteDto: UpdateAlertasReporteDto) {
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
  }
}
