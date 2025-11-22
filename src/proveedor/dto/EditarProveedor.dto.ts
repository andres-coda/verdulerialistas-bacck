import { IsArray, IsEmail, IsOptional, IsString, IsUUID, Length } from "class-validator";
import { BaseDto } from "../../base/dto/BaseDto.dto";

export class EditarProveedor extends BaseDto {
  @IsOptional()
  @IsString()
  @Length(1, 50, { message: 'El nombre no debe tener mas de 50 caracteres' })
  nombre?: string;

  @IsOptional()
  @IsString()
  @Length(1, 20, { message: "El telefono no puede tener mas de 20 caracteres" })
  telefono?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsArray({ message: "productos debe ser un array de IDs" })
  @IsUUID("4", { each: true, message: "Cada producto debe ser un UUID válido" })
  productos?: string[];
}