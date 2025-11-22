
import { IsOptional, IsString, Length } from "class-validator";

export class EditarRubro{
  @IsOptional()
  @IsString()
  @Length(1, 50, { message: 'El nombre no debe tener mas de 50 caracteres' })
  nombre?: string;
}