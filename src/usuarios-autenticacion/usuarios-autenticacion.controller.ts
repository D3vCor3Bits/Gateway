import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Inject,
  Req,
  ParseIntPipe,
  ParseUUIDPipe,
  Query,
} from '@nestjs/common';
import type { Request } from 'express';
import { CreateUsuariosAutenticacionDto } from './dto/create-usuarios-autenticacion.dto';
import { NATS_SERVICE } from 'src/config';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { catchError } from 'rxjs';
import { loginUsuarioDto } from './dto/login-usuario.dto';
import { asignarMedpacienteDto } from './dto/asignar-medpaciente.dto';
import { asignarCuidadorPacienteDto } from './dto/asignar-pacientecuidador.dto';
import { crearInvitacionDto } from './dto/crear-invitacion.dto';
import { actualizarContraseñaDto } from './dto/actualizar-contraseña.dto';
import { ActualizarCorreoDto } from './dto/actualizar-correo.dto';
import { subirImagenDto } from './dto/subir-imagen.dto';

@Controller('usuarios-autenticacion')
export class UsuariosAutenticacionController {
  constructor(@Inject(NATS_SERVICE) private readonly client: ClientProxy) {}

  @Post('crearUsuario')
  create(@Body() dto: CreateUsuariosAutenticacionDto) {
    return this.client.send({ cmd: 'createUsuariosAutenticacion' }, dto).pipe(
      catchError((err) => {
        throw new RpcException(err);
      }),
    );
  }
  @Post('login')
  login(@Body() dto: loginUsuarioDto) {
    return this.client.send({ cmd: 'loginUsuario' }, dto).pipe(
      catchError((err) => {
        throw new RpcException(err);
      }),
    );
  }

  @Get('buscarUsuarios')
  findAll() {
    return this.client.send({ cmd: 'findUsers' }, {});
  }

  @Get('buscarUsuario/:id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    //Tener mucho cuidado con el tipo de dato del Id, importante parsear
    //para que cuando se hagan consultas a BD no de error
    //IMPORTANTE: hacer el throw del RpcException y asegurarse de estar haciendo el throw en el microservicio para que lance la excepción que es, REVISAR EL RESTO DEL CÓDIGO (descripciones y el otro repo) PARA ENTENDER
    return this.client.send({ cmd: 'findUserById' }, { id }).pipe(
      catchError((err) => {
        throw new RpcException(err);
      }),
    );
  }

  @Delete('borrarPerfil/:id')
  remove(@Param('id') id: string) {
    return this.client.send({ cmd: 'removeUsuariosAutenticacion' }, {});
  }

  @Post('asignarMedico')
  asignarMedico(@Body() dto: asignarMedpacienteDto) {
    return this.client.send({ cmd: 'asignarMedpaciente' }, dto).pipe(
      catchError((err) => {
        throw new RpcException(err);
      }),
    );
  }

  @Get('pacienteCuidador/:idCuidador')
  traerPacienteDeCuidador(
    @Param('idCuidador', ParseUUIDPipe) idCuidador: string,
  ) {
    return this.client.send({ cmd: 'pacienteCuidador' }, { idCuidador }).pipe(
      catchError((err) => {
        throw new RpcException(err);
      }),
    );
  }

  @Get('medicoPaciente/:idPaciente')
  traerMedicoDeCuidador(
    @Param('idPaciente', ParseUUIDPipe) idPaciente: string,
  ) {
    return this.client.send({ cmd: 'pacienteMedico' }, { idPaciente }).pipe(
      catchError((err) => {
        throw new RpcException(err);
      }),
    );
  }
  
  @Get('pacientesMedico/:idMedico')
  traerPacientesdeMedico(
    @Param('idPaciente', ParseUUIDPipe) idPaciente: string,
  ) {
    return this.client.send({ cmd: 'medicoPaciente' }, { idPaciente }).pipe(
      catchError((err) => {
        throw new RpcException(err);
      }),
    );
  }

  @Post('asignarCuidador')
  asignarCuidador(@Body() dto: asignarCuidadorPacienteDto) {
    return this.client.send({ cmd: 'asignarCuidadorPaciente' }, dto).pipe(
      catchError((err) => {
        throw new RpcException(err);
      }),
    );
  }
  @Post('crearInvitacion')
  crearInvitacion(@Body() dto: crearInvitacionDto) {
    return this.client.send({ cmd: 'crearInvitacion' }, dto).pipe(
      catchError((err) => {
        throw new RpcException(err);
      }),
    );
  }

  @Get('verificarToken')
  verificarInvitacion(@Query('token') token: string) {
    return this.client.send({ cmd: 'verificarInvitacion' }, { token }).pipe(
      catchError((err) => {
        throw new RpcException(err);
      }),
    );
  }

  @Get('pacientesDeMedico/:idMedico')
  pacientesMedico(@Param('idMedico', ParseUUIDPipe) idMedico: string) {
    return this.client.send({ cmd: 'pacientesMedico' }, { idMedico });
  }

  @Get('totalUsuarios')
  totalUsuarios() {
    return this.client.send({ cmd: 'totalUsuarios' }, {});
  }

  @Post('enviarOTP')
  enviarOTP(@Body('email') email: string) {
    return this.client.send({ cmd: 'enviarOTP' }, { email }).pipe(
      catchError((err) => {
        throw new RpcException(err);
      }),
    );
  }

  @Post('perfil')
  async obtenerPerfil(@Req() req: Request) {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      throw new RpcException('Token no proporcionado');
    }

    const token = authHeader.replace('Bearer ', '');

    return this.client.send({ cmd: 'getPerfilUsuario' }, { token }).pipe(
      catchError((err) => {
        throw new RpcException(err);
      }),
    );
  }

  @Patch('actualizarContrasena')
  actualizarContraseña(
    @Body() dto: actualizarContraseñaDto,
    @Req() req: Request,
  ) {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      throw new RpcException('Token no proporcionado');
    }
    const token = authHeader.replace('Bearer ', '');
    return this.client.send({ cmd: 'contraseña' }, { ...dto, token }).pipe(
      catchError((err) => {
        throw new RpcException(err);
      }),
    );
  }
  @Patch('actualizarCorreo')
  actualizarCorreo(@Body() dto: ActualizarCorreoDto, @Req() req: Request) {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      throw new RpcException('Token no proporcionado');
    }

    const token = authHeader.replace('Bearer ', '');

    return this.client
      .send({ cmd: 'actualizar-correo' }, { ...dto, token })
      .pipe(
        catchError((err) => {
          throw new RpcException(err);
        }),
      );
  }
  @Get('usuariosSinRelacion')
  findUsuariosSinRelacion() {
    return this.client.send({ cmd: 'findUsuariosSinRelacion' }, {}).pipe(
      catchError((err) => {
        throw new RpcException(err);
      }),
    );
  }

  @Delete('eliminarPacienteCuidador')
  eliminarPacienteCuidador(@Body() dto: asignarCuidadorPacienteDto) {
    return this.client.send({ cmd: 'eliminarPacienteCuidador' }, dto).pipe(
      catchError((err) => {
        throw new RpcException(err);
      }),
    );
  }

  @Get('pruebak8s')
  pruebak8s() {
    return {
      message: '¡Hola desde Kubernetes!',
      timestamp: new Date().toISOString(),
      service: 'usuarios-autenticacion-ms',
      version: '2.0',
    };
  }

  @Patch('cuentaInactiva')
  cuentaInactiva(@Body('userId', ParseUUIDPipe) userId: string) {
    return this.client.send({ cmd: 'cuentaInactiva' }, { userId }).pipe(
      catchError((err) => {
        throw new RpcException(err);
      }),
    );
  }

  @Post('imagenPerfil')
  imagenPerfil(@Body() dto: subirImagenDto) {
    return this.client.send({ cmd: 'imagenPerfil' }, dto).pipe(
      catchError((err) => {
        throw new RpcException(err);
      }),
    );
  }

  @Patch('actualizarImagenPerfil')
  actualizarImagenPerfil(@Body() dto: subirImagenDto) {
    return this.client.send({ cmd: 'actualizarImagenPerfil' }, dto).pipe(
      catchError((err) => {
        throw new RpcException(err);
      }),
    );
  }

  @Delete('eliminarFotoPerfil/:userId')
  eliminarFotoPerfil(@Param('userId', ParseUUIDPipe) userId: string) {
    return this.client.send({ cmd: 'eliminarFotoPerfil' }, { userId }).pipe(
      catchError((err) => {
        throw new RpcException(err);
      }),
    );
  }
}
