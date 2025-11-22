import { IsArray, IsNotEmpty, IsUUID } from "class-validator";
import { BaseDto } from "../../base/dto/BaseDto.dto";

export class AddProductoProveedor extends BaseDto {
  @IsNotEmpty()
  @IsArray({ message: "productos debe ser un array de IDs" })
  @IsUUID("4", { each: true, message: "Cada producto debe ser un UUID válido" })
  productos!: string[];
}