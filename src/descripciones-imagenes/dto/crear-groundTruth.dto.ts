import {IsNumber, IsString, IsPositive, IsArray} from 'class-validator';


export class CrearGroundTruthDto{

    @IsString()
    texto: string;

    @IsNumber()
    @IsPositive()
    idImagen: number;

    @IsArray()
    palabrasClave: string[];

    @IsArray()
    preguntasGuiaPaciente: string[];
}