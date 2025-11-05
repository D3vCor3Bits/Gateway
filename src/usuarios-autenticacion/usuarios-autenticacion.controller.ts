import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Inject,
  ParseIntPipe,
  ParseUUIDPipe,
} from '@nestjs/common';
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
    return this.client.send({ cmd: 'findAllUsuariosAutenticacion' }, {});
  }

  @Get('buscarUsuario/:id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    //Tener mucho cuidado con el tipo de dato del Id, importante parsear
    //para que cuando se hagan consultas a BD no de error
    //IMPORTANTE: hacer el throw del RpcException y asegurarse de estar haciendo el throw en el microservicio para que lance la excepción que es, REVISAR EL RESTO DEL CÓDIGO (descripciones y el otro repo) PARA ENTENDER
    return this.client
      .send({ cmd: 'findUserById'}, { id })
      .pipe(
        catchError((err) => {
          throw new RpcException(err);
        }),
      );
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
  traerPacienteDeCuidador(@Param('idCuidador', ParseUUIDPipe) idCuidador: string){
    return this.client.send({cmd:'pacienteCuidador'},{idCuidador}).
    pipe(catchError(err => {
      throw new RpcException(err);
    }))
  }

  @Get('medicoPaciente/:idPaciente')
  traerMedicoDeCuidador(@Param('idPaciente', ParseUUIDPipe) idPaciente: string){
    return this.client.send({cmd:'pacienteMedico'},{idPaciente}).
    pipe(catchError(err => {
      throw new RpcException(err);
    }))
  }
   @Post('asignarCuidador')
  asignarCuidador(@Body() dto: asignarCuidadorPacienteDto) {
    return this.client.send({ cmd: 'pacienteCuidador' }, dto).pipe(
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
}
