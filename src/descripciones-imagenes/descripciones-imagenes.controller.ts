import { Controller, Get, Post, Body, Patch, Param, Delete, Inject, UseInterceptors, UploadedFile, UploadedFiles, ParseFilePipe, MaxFileSizeValidator, FileTypeValidator, ParseIntPipe, Query } from '@nestjs/common';
import { NATS_SERVICE } from 'src/config';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import {FileInterceptor, FilesInterceptor} from '@nestjs/platform-express'
import { catchError, throwError } from 'rxjs';
import { CrearGroundTruthDto, sesionEstadoDto } from './dto';
import { CrearSesionDto } from './dto/crear-sesion.dto';
import { PaginationDto } from 'src/common';

@Controller('descripciones-imagenes')
export class DescripcionesImagenesController {
  constructor(
    @Inject(NATS_SERVICE) private readonly client: ClientProxy
  ) {}

  //--------------IMAGENES----------------
  
  @Post('uploadImage')
  @UseInterceptors(FileInterceptor('file'))
  uploadFile(@UploadedFile(
    new ParseFilePipe({
      validators: [
        new MaxFileSizeValidator({maxSize: 1024*1024*4}),
        new FileTypeValidator({fileType: '.(png|jpeg|jpg)'}),
      ]
    })
  ) file: Express.Multer.File) {
    // Convert buffer to base64 to ensure it serializes correctly over the transport (NATS)
    const payload = {
      originalname: file.originalname,
      mimetype: file.mimetype,
      encoding: file.encoding,
      size: file.size,
      // base64 string
      bufferBase64: file.buffer.toString('base64'),
      idUsuario: 1 //TODO: MIRAR ESTO COMO PASARLO DE MANERA ADECUADA
    };
    return this.client.send({cmd:'uploadImageCloudinary'}, payload)
    .pipe(
      catchError((err) => {
        return throwError(() => new RpcException(err));
      })
    );
  }

  //REVISAR PARA MANDAR VARIAS IMAGENES DE UNA
  @Post('uploadImages')
  @UseInterceptors(FilesInterceptor('files'))
  uploadFiles(@UploadedFiles(
    new ParseFilePipe({
      validators: [
        new MaxFileSizeValidator({maxSize: 1024*1024*4}),
        new FileTypeValidator({fileType: '.(png|jpeg|jpg)'}),
      ]
    })
  ) files: Express.Multer.File[]) {
    const payload = files.map((file) => ({
      originalname: file.originalname,
      mimetype: file.mimetype,
      encoding: file.encoding,
      size: file.size,
      bufferBase64: file.buffer.toString('base64'),
    }));

    return this.client.send({cmd:'uploadImagesCloudinary'}, payload)
    .pipe(
      catchError((err) => {
        return throwError(() => new RpcException(err));
      })
    );
  }

  @Get("todos")
  findAll() {
    return "hola" 
  }

  //Buscar una imagen por id
  @Get('buscarImagen/:id')
  buscarImagen(@Param('id', ParseIntPipe) id: number) {
    return this.client.send({cmd:'buscarImagen'}, {id})
    .pipe(
      catchError(err => {
        throw new RpcException(err);
      })
    )
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDescripcionesImageneDto: any) {
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
  }

  //DESCRIPCION
  

  //--------------GROUNDTRUH----------------

  //Crear groundTruth
  @Post('crearGroundTruth')
  crearGroundTruth(@Body() grondTruthDto: CrearGroundTruthDto){
    return this.client.send({cmd:'crearGroundTruth'}, grondTruthDto)
    .pipe(
      catchError(err => {
        throw new RpcException(err)
      })
    )
  }

  //Buscar groundTruth por id
  @Get('buscarGroundTruth/:id')
  buscarGroundTruth(@Param('id', ParseIntPipe) id: number){
    return this.client.send({cmd:'buscarGroundTruth'}, {id})
    .pipe(
      catchError(err => {
        throw new RpcException(err)
      })
    )
  }

  //Buscar groundTruth por id imágen
  @Get('buscarGroundTruth/:id')
  buscarGroundTruthIdImagen(@Param('id', ParseIntPipe) id: number){
    return this.client.send({cmd:'buscarGroundTruthIdImagen'}, {id})
    .pipe(
      catchError(err => {
        throw new RpcException(err)
      })
    )
  }

  //---------------SESSIONS-----------------
  //Crear sesión
  @Post('crearSesion')
  crearSesion(@Body() crearSesionDto: CrearSesionDto){
    return this.client.send({cmd:'crearSesion'},crearSesionDto)
    .pipe(
      catchError(err => {
        throw new RpcException(err);
      })
    )
  }

  //Listar sesiones


  //Listar sesiones por estado
  @Get('sesionesEstado/:status')
  listarSesionesEstado(@Param() sesionEstadoDto: sesionEstadoDto, @Query() paginationDto: PaginationDto){
    return this.client.send({cmd:'listarSesiones'},{...paginationDto, estado_sesion: sesionEstadoDto.estado_sesion})
    .pipe(
      catchError(err => {
        throw new RpcException(err);
      })
    )
  } 


  //PUNTAJE


}
