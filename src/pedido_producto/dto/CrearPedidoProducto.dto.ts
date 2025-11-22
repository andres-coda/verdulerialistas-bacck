import { Column, OneToMany } from "typeorm";
import { Pedido } from "../../pedido/entity/Pedido.entity";
import { Producto } from "../../producto/entity/Producto.entity";
import { BaseDto } from "../../base/dto/BaseDto.dto";
import { IsNotEmpty, IsNumber, IsUUID, ValidateNested } from "class-validator";
import { CrearPedidoProductoParcial } from "./CrearPedidoProductoParcial.dto";
import { Type } from "class-transformer";

export class CrearPedidoProducto extends CrearPedidoProductoParcial {
  @IsNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => Pedido)
  pedido: Pedido;
}