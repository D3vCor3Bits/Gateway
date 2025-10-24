import {IsNumber, IsEnum, IsString, IsOptional} from 'class-validator';
import { estado_sesion, estadoListDto } from '../enum/estado.enum';

export class CrearSesionDto{

    @IsNumber()
    idPaciente: number

    @IsOptional()
    fechaInicio: Date

    @IsEnum(estadoListDto, {
        message: `Los status válidos son: ${estadoListDto}`
    })
    @IsOptional()
    estado: estado_sesion

    @IsNumber()
    @IsOptional()
    sessionRecall: number

    @IsNumber()
    @IsOptional()
    sessionComision: number

    @IsNumber()
    @IsOptional()
    sessionCoherencia: number

    @IsNumber()
    @IsOptional()
    sessionTotal: number

    @IsString()
    @IsOptional()
    conclusion: string
}