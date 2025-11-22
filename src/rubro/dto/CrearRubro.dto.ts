
import { IsNotEmpty, IsString, Length } from "class-validator";
import { BaseDto } from "../../base/dto/BaseDto.dto";

export class CrearRubro extends BaseDto{
  @IsNotEmpty()
  @IsString()
  @Length(1, 50, { message: 'El nombre no debe tener mas de 50 caracteres' })
  nombre!: string;
}