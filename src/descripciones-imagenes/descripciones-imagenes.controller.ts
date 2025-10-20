import { Controller, Get, Post, Body, Patch, Param, Delete, Inject, UseInterceptors, UploadedFile, UploadedFiles, ParseFilePipe, MaxFileSizeValidator, FileTypeValidator } from '@nestjs/common';
import { UpdateDescripcionesImageneDto } from './dto/update-descripciones-imagene.dto';
import { NATS_SERVICE } from 'src/config';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import {FileInterceptor, FilesInterceptor} from '@nestjs/platform-express'
import { catchError, throwError } from 'rxjs';

@Controller('descripciones-imagenes')
export class DescripcionesImagenesController {
  constructor(
    @Inject(NATS_SERVICE) private readonly client: ClientProxy
  ) {}

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
