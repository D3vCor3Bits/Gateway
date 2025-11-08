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
import { UpdateUsuariosAutenticacionDto } from './dto/update-usuarios-autenticacion.dto';
import { NATS_SERVICE } from 'src/config';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { catchError } from 'rxjs';
import { loginUsuarioDto } from './dto/login-usuario.dto';
import { asignarMedpacienteDto } from './dto/asignar-medpaciente.dto';
import { asignarCuidadorPacienteDto } from './dto/asignar-pacientecuidador.dto';
import { crearInvitacionDto } from './dto/crear-invitacion.dto';

@Controller('usuarios-autenticacion')
export class UsuariosAutenticacionController {
  constructor(@Inject(NATS_SERVICE) private readonly client: ClientProxy) { }

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
  findAll(@Req() req: Request) {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      throw new RpcException('Token no proporcionado');
    }
    const token = authHeader.replace('Bearer ', '');

    return this.client
      .send({ cmd: 'findUsers' }, { token })
      .pipe(catchError((err) => { throw new RpcException(err); }));
  }

  @Get('buscarUsuario/:id')
  findOne(@Req() req: Request, @Param('id', ParseUUIDPipe) id: string) {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      throw new RpcException('Token no proporcionado');
    }
    const token = authHeader.replace('Bearer ', '');

    return this.client
      .send({ cmd: 'findUserById' }, { token, id })
      .pipe(catchError((err) => { throw new RpcException(err); }));
  }

  @Patch('actualizarPerfil/:id')
  update(
    @Param('id') id: string,
    @Body() updateUsuariosAutenticacionDto: UpdateUsuariosAutenticacionDto,
  ) {
    return this.client.send({ cmd: 'updateUsuariosAutenticacion' }, {});
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
  traerMedicoDePaciente(@Req() req: Request, @Param('idPaciente', ParseUUIDPipe) idPaciente: string) {
    const authHeader = req.headers.authorization;
    if (!authHeader) throw new RpcException('Token no proporcionado');
    const token = authHeader.replace('Bearer ', '');

    return this.client
      .send({ cmd: 'pacienteMedico' }, { token, idPaciente })
      .pipe(catchError((err) => { throw new RpcException(err); }));
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
  pacientesMedico(@Req() req: Request, @Param('idMedico', ParseUUIDPipe) idMedico: string) {
    const authHeader = req.headers.authorization;
    if (!authHeader) throw new RpcException('Token no proporcionado');
    const token = authHeader.replace('Bearer ', '');

    return this.client
      .send({ cmd: 'pacientesMedico' }, { token, idMedico })
      .pipe(catchError((err) => { throw new RpcException(err); }));
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


  @Get('perfil')
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
  @Post('subirFotoPerfil')
  async subirImagenPerfil(@Req() req: Request, @Body('imagenUrl') imagenUrl: string) {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      throw new RpcException('Token no proporcionado');
    }

    const token = authHeader.replace('Bearer ', '');

    return this.client
      .send({ cmd: 'uploadProfileImage' }, { token, imagenUrl })
      .pipe(
        catchError((err) => {
          throw new RpcException(err);
        }),
      );
  }
  @Patch('desactivarUsuario')
  async eliminarCuenta(@Req() req: Request) {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      throw new RpcException('Token no proporcionado');
    }
    const token = authHeader.replace('Bearer ', '');
    return this.client.send({ cmd: 'desactivarUsuario' }, { token }).pipe(
      catchError((err) => {
        throw new RpcException(err);
      }),
    );
  }
}
