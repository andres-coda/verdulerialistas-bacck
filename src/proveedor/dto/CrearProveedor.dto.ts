import { IsArray, IsEmail, IsNotEmpty, IsString, IsUUID, Length } from "class-validator";
import { BaseDto } from "../../base/dto/BaseDto.dto";

export class CrearProveedor extends BaseDto {
  @IsNotEmpty()
  @IsString()
  @Length(1, 50, { message: 'El nombre no debe tener mas de 50 caracteres' })
  nombre!: string;

  @IsNotEmpty()
  @IsString()
  @Length(1, 20, { message: "El telefono no puede tener mas de 20 caracteres" })
  telefono!: string;

  @IsNotEmpty()
  @IsEmail()
  email!: string;

  @IsNotEmpty()
  @IsArray({ message: "productos debe ser un array de IDs" })
  @IsUUID("4", { each: true, message: "Cada producto debe ser un UUID válido" })
  productos!: string[];
}