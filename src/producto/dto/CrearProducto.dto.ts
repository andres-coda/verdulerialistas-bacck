import { IsNotEmpty, IsString, IsUUID, Length } from "class-validator";
import { BaseDto } from "../../base/dto/BaseDto.dto";

export class CrearProducto extends BaseDto{
  @IsNotEmpty()
  @IsString()
  @Length(1, 50, { message: 'El nombre no debe tener mas de 50 caracteres' })
  nombre!: string;

  @IsNotEmpty()
  @IsString()
  @Length(1, 50, { message: 'Unidad no debe tener mas de 50 caracteres' })
  unidad!: string;

  @IsNotEmpty()
  @IsUUID()
  rubro!:string;
}