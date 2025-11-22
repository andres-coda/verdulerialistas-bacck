import { ArrayMinSize, IsDate, isNotEmpty, IsNotEmpty, IsOptional, IsString, IsUUID, ValidateNested } from "class-validator";
import { BaseDto } from "../../base/dto/BaseDto.dto";
import { CrearPedidoProducto } from "../../pedido_producto/dto/CrearPedidoProducto.dto";
import { Type } from "class-transformer";
import { CrearPedidoProductoParcial } from "../../pedido_producto/dto/CrearPedidoProductoParcial.dto";

export class CrearPedido extends BaseDto {
  @IsNotEmpty()
  @IsDate()
  fecha: Date;

  @IsOptional()
  @IsString()
  estado?: string;

  @IsNotEmpty()
  @IsUUID("4", { each: true, message: "Cada pedido debe ser un UUID válido" })
  proveedor: string;

  @IsNotEmpty()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => CrearPedidoProductoParcial)
  productos: CrearPedidoProductoParcial[];
}