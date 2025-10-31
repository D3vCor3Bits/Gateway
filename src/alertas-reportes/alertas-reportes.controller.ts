import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AlertasReportesService } from './alertas-reportes.service';
import { CreateAlertasReporteDto } from './dto/create-alertas-reporte.dto';
import { UpdateAlertasReporteDto } from './dto/update-alertas-reporte.dto';

@Controller('alertas-reportes')
export class AlertasReportesController {
  constructor(private readonly alertasReportesService: AlertasReportesService) {}

  @Post()
  create(@Body() createAlertasReporteDto: CreateAlertasReporteDto) {
    return this.alertasReportesService.create(createAlertasReporteDto);
  }

  @Get()
  findAll() {
    return this.alertasReportesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.alertasReportesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAlertasReporteDto: UpdateAlertasReporteDto) {
    return this.alertasReportesService.update(+id, updateAlertasReporteDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.alertasReportesService.remove(+id);
  }
}
