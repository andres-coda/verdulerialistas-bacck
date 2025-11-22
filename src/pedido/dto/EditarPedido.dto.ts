import { ArrayMinSize, IsDate, IsOptional, IsString, IsUUID, ValidateNested } from "class-validator";
import { BaseDto } from "../../base/dto/BaseDto.dto";
import { CrearPedidoProductoParcial } from "../../pedido_producto/dto/CrearPedidoProductoParcial.dto";
import { Type } from "class-transformer";

export class EditarPedido extends BaseDto {
  @IsOptional()
  @IsDate()
  fecha?: Date;

  @IsOptional()
  @IsString()
  estado?: string;

  @IsOptional()
  @IsUUID("4", { each: true, message: "Cada pedido debe ser un UUID válido" })
  proveedor: string;

  @IsOptional()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => CrearPedidoProductoParcial)
  productos?: CrearPedidoProductoParcial[];
}