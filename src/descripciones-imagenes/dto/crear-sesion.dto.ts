import {IsNumber, IsEnum, IsString, IsOptional, IsArray, IsDate, IsBoolean} from 'class-validator';
import { Type } from 'class-transformer';
import { estado_sesion, estadoListDto } from '../enum/estado.enum';

export class CrearSesionDto{

    @IsString()
    idCuidador: string

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
    sessionOmision: number

    @IsNumber()
    @IsOptional()
    sessionCoherencia: number

    @IsNumber()
    @IsOptional()
    sessionFluidez: number

    @IsNumber()
    @IsOptional()
    sessionTotal: number

    @IsString()
    @IsOptional()
    conclusionTecnica: string

    @IsString()
    @IsOptional()
    conclusionNormal: string

    @IsArray()
    imagenesIds: number[]

    @IsOptional()
    @Type(() => Date)
    @IsDate()
    fechaInicioPropuesta?: Date
}