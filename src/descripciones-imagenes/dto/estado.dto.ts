import { IsEnum, IsOptional } from "class-validator";
import { estado_sesion, estadoListDto } from "../enum/estado.enum";


export class sesionEstadoDto{
    @IsOptional()
    @IsEnum(estadoListDto, {
        message: `Estados de sesión válido: ${estadoListDto}`
    })
    estado_sesion: estado_sesion
}