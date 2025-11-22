import { IsOptional, IsString, IsUUID, Length } from "class-validator";
import { BaseDto } from "../../base/dto/BaseDto.dto";

export class EditarProducto extends BaseDto{
  @IsOptional()
  @IsString()
  @Length(1, 50, { message: 'El nombre no debe tener mas de 50 caracteres' })
  nombre?: string;

  @IsOptional()
  @IsString()
  @Length(1, 50, { message: 'Unidad no debe tener mas de 50 caracteres' })
  unidad?: string;

  @IsOptional()
  @IsUUID()
  rubro?:string;
}