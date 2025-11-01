import { ArrayMinSize, IsArray, ValidateNested } from "class-validator";
import { SesionPuntajeDto } from "./sesion.puntaje.dto";
import { Type } from "class-transformer";


export class ReporteDto{
    @IsArray()
    @ArrayMinSize(1)
    @ValidateNested({each: true})
    @Type(() => SesionPuntajeDto)
    sesionesPuntajes: SesionPuntajeDto[]
}