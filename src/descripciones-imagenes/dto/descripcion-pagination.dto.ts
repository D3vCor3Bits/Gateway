import { IsNumber, IsPositive, IsString } from "class-validator";
import { PaginationDto } from "src/common";

export class DescripcionPaginationDto extends PaginationDto{
    @IsString()
    idSesion: string
}