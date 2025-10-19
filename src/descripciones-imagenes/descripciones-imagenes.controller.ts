import { Controller, Get, Post, Body, Patch, Param, Delete, Inject } from '@nestjs/common';
import { CreateDescripcionesImageneDto } from './dto/create-descripciones-imagene.dto';
import { UpdateDescripcionesImageneDto } from './dto/update-descripciones-imagene.dto';
import { NATS_SERVICE } from 'src/config';
import { ClientProxy } from '@nestjs/microservices';

@Controller('descripciones-imagenes')
export class DescripcionesImagenesController {
  constructor(
    @Inject(NATS_SERVICE) private readonly client: ClientProxy
  ) {}

  @Post()
  create(@Body() createDescripcionesImageneDto: CreateDescripcionesImageneDto) {
    return this.client.send({cmd:'createDescripcionesImagene'}, {});
  }

  @Get()
  findAll() {
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDescripcionesImageneDto: UpdateDescripcionesImageneDto) {
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
  }
}
