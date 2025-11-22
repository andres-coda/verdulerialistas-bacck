import { Column, Entity, ManyToOne } from "typeorm";
import { Base } from "../../base/entity/Base.entity";
import { Pedido } from "../../pedido/entity/Pedido.entity";
import { Producto } from "../../producto/entity/Producto.entity";

@Entity('pedido_producto')
export class PedidoProducto extends Base {
  @Column("decimal", { precision: 10, scale: 1 })
  cantidad: number;

  @ManyToOne(() => Pedido, pedido => pedido.pedidos_productos)
  pedido: Pedido;

  @ManyToOne(() => Producto, prod => prod.pedidos_productos)
  producto: Producto;

  constructor() {
    super()
  }
}