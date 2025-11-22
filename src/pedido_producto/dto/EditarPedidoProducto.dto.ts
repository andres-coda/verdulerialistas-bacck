import { IsNumber, IsOptional, IsUUID } from "class-validator";
import { BaseDto } from "../../base/dto/BaseDto.dto";

export class EditarPedidoProducto extends BaseDto {
  @IsOptional()
  @IsNumber()
  cantidad: number;
}