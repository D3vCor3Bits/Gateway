import { Controller, Get, Post, Body, Patch, Param, Delete, Inject, UseInterceptors, UploadedFile, UploadedFiles, ParseFilePipe, MaxFileSizeValidator, FileTypeValidator, ParseIntPipe, Query, UsePipes, ValidationPipe } from '@nestjs/common';
import { NATS_SERVICE } from 'src/config';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import {FileInterceptor, FilesInterceptor} from '@nestjs/platform-express'
import { catchError, throwError } from 'rxjs';
import { ActualizarGroundTruthDto, ActualizarSesionDto, CrearDescriptionDto, CrearGroundTruthDto, DescripcionPaginationDto, ImagenPaginationDto, SesionPaginationDto } from './dto';
import { CrearSesionDto } from './dto/crear-sesion.dto';

@Controller('descripciones-imagenes')
export class DescripcionesImagenesController {
  constructor(
    @Inject(NATS_SERVICE) private readonly client: ClientProxy
  ) {}

  /*-------------------------------------------------------------------------*/
  /*---------------------------------IMÁGENES--------------------------------*/
  /*-------------------------------------------------------------------------*/
  
  /* SUBIR IMAGEN */
  @Post('uploadImage/:idUsuario')
  @UseInterceptors(FileInterceptor('file'))
  uploadFile(@UploadedFile(
    new ParseFilePipe({
      validators: [
        new MaxFileSizeValidator({maxSize: 1024*1024*10}),
        new FileTypeValidator({fileType: '.(png|jpeg|jpg)'}),
      ]
    })
  ) file: Express.Multer.File, @Param('idUsuario', ParseIntPipe) idUsuario: number) {
    // Convert buffer to base64 to ensure it serializes correctly over the transport (NATS)
    const payload = {
      originalname: file.originalname,
      mimetype: file.mimetype,
      encoding: file.encoding,
      size: file.size,
      // base64 string
      bufferBase64: file.buffer.toString('base64'),
      idUsuario: idUsuario
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

  /* LISTAR IMAGENES SUBIDAS POR UN CUIDADOR */
  @Get("listarImagenes/:cuidadorId")
  listarImagenes(@Query() imagenPaginationDto: ImagenPaginationDto, @Param('cuidadorId', ParseIntPipe) cuidadorId: number ) {
    return this.client.send({cmd:'listarImagenes'}, {cuidadorId, ...imagenPaginationDto}).
    pipe(catchError(err => {
      throw new RpcException(err);
    }))
  }

  /* BUSCAR IMAGEN POR ID */
  @Get('buscarImagen/:id')
  buscarImagen(@Param('id', ParseIntPipe) id: number) {
    return this.client.send({cmd:'buscarImagen'}, {id})
    .pipe(
      catchError(err => {
        throw new RpcException(err);
      })
    )
  }

  /* ELIMINAR IMAGEN */
  @Delete('eliminar/:id')
  eliminarImagen(@Param('id') id: string) {
    return this.client.send({cmd:'eliminarImagen'}, {id}).
    pipe(catchError(err => {
      throw new RpcException(err);
    }))
  }  

  /*-------------------------------------------------------------------------*/
  /*---------------------------------GROUNDTRUH--------------------------------*/
  /*-------------------------------------------------------------------------*/

  /* CREAR GROUNDTRUTH */
  @Post('crearGroundTruth')
  crearGroundTruth(@Body() grondTruthDto: CrearGroundTruthDto){
    return this.client.send({cmd:'crearGroundTruth'}, grondTruthDto)
    .pipe(
      catchError(err => {
        throw new RpcException(err)
      })
    )
  }

  /*BUSCAR GROUNDTRURH ID */
  @Get('buscarGroundTruth/:id')
  buscarGroundTruth(@Param('id', ParseIntPipe) id: number){
    return this.client.send({cmd:'buscarGroundTruth'}, {id})
    .pipe(
      catchError(err => {
        throw new RpcException(err)
      })
    )
  }

  /* BUSCAR GROUNDTRUTH POR ID IMAGEN*/
  @Get('buscarGroundTruthImagen/:id')
  buscarGroundTruthIdImagen(@Param('id', ParseIntPipe) id: number){
    return this.client.send({cmd:'buscarGroundTruthIdImagen'}, {id})
    .pipe(
      catchError(err => {
        throw new RpcException(err)
      })
    )
  }

  /* ACTUALIZAR GROUNDTRUTH */
  @Patch('actualizarGt/:id')
  actualizarGroundTruth(@Param('id', ParseIntPipe) id: number, @Body() actualizarGroundTruthDto: ActualizarGroundTruthDto){
    return this.client.send({cmd:'actualizarGroundTruth'}, {id, ...actualizarGroundTruthDto}).
    pipe(catchError(err => {
      throw new RpcException(err);
    }))
  }

  @Delete('eliminarGroundTruth/:id')
  elimiarGroundTruth(@Param('id', ParseIntPipe) id: number){
    return this.client.send({cmd:'eliminarGroundTruth'}, {id}).
    pipe(catchError(err => {
      throw new RpcException(err);
    }))
  }

  /*-------------------------------------------------------------------------*/
  /*---------------------------------SESIONES--------------------------------*/
  /*-------------------------------------------------------------------------*/

  /* CREAR SESIÓN */
  @Post('crearSesion')
  crearSesion(@Body() crearSesionDto: CrearSesionDto){
    return this.client.send({cmd:'crearSesion'},crearSesionDto)
    .pipe(
      catchError(err => {
        throw new RpcException(err);
      })
    )
  }


  /* BUSCAR SESIÓN */
  @Get('buscarSesion/:id')
  buscarSesion(@Param('id', ParseIntPipe) id: number){
    return this.client.send({cmd:'buscarSesion'}, {id}).
    pipe(catchError(err => {
      throw new RpcException(err);
    }))
  }


  /* LISTAR SESIONES */
  @Get('listarSesiones')
  listarSesiones(@Query() sesionPaginationDto: SesionPaginationDto){
    return this.client.send({cmd:'listarSesiones'}, sesionPaginationDto)
    .pipe(
      catchError(err => {
        throw new RpcException(err);
      })
    )
  }

  @Patch('actualizarSesion/:id')
  actualizarSesion(@Body() actualizarSesionDto: ActualizarSesionDto, @Param('id', ParseIntPipe) id: number){
    return this.client.send({cmd:'actualizarSesion'}, {id, ...actualizarSesionDto}).
    pipe(catchError(err => {
      throw new RpcException(err);
    }))

  }

  /*-------------------------------------------------------------------------*/
  /*---------------------------------DESCRIPCIÓN--------------------------------*/
  /*-------------------------------------------------------------------------*/

  /* CREAR DESCRIPCIÓN */
  @Post('crearDescripcion')
  crearDescripcion(@Body() crearDescripcionDto: CrearDescriptionDto){
    return this.client.send({cmd:'crearDescripcion'}, crearDescripcionDto)
    .pipe(
      catchError(err => {
        throw new RpcException(err);
      })
    )
  }

  /* BUSCAR DESCRIPCIÓN */
  @Get('buscarDescripcion/:id')
  buscarDescripcion(@Param('id', ParseIntPipe) id: number){
    return this.client.send({cmd:'buscarDescripcion'}, {id}).
    pipe(catchError(err =>{
      throw new RpcException(err);
    }))
  }

  /* LISTAR DESCRIPCIONES DE UNA SESIÓN*/
  @Get('listarDescripciones/:id')
  listarDescripciones(@Query() descripcionesPaginationDto: DescripcionPaginationDto){
    return this.client.send({cmd:'listarDescripciones'},descripcionesPaginationDto).
    pipe(catchError(err =>{
      throw new RpcException(err);
    }))
  }
}
