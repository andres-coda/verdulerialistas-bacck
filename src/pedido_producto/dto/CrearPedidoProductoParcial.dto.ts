import { IsNotEmpty, IsNumber, IsUUID } from "class-validator";
import { BaseDto } from "../../base/dto/BaseDto.dto";
import { Type } from "class-transformer";

export class CrearPedidoProductoParcial extends BaseDto {
  @IsNotEmpty()
  @IsNumber({ maxDecimalPlaces: 1 })
  @Type(() => Number)
  cantidad: number;

  @IsNotEmpty()
  @IsUUID("4", { each: true, message: "Cada producto debe ser un UUID válido" })
  producto: string;
}