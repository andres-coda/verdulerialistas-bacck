import { Column, Entity, ManyToOne, OneToMany } from "typeorm";
import { Base } from "../../base/entity/Base.entity";
import { Proveedor } from "../../proveedor/entity/Proveedor.entity";
import { PedidoProducto } from "../../pedido_producto/entity/PedidoProducto";

@Entity('pedido')
export class Pedido extends Base {
  @Column()
  fecha:Date;

  @Column()
  estado:string;

  @ManyToOne(()=>Proveedor, prov=> prov.pedidos)
  proveedor:Proveedor;

  
  @OneToMany(()=>PedidoProducto, pedido => pedido.pedido)
  pedidos_productos:PedidoProducto[];

  constructor(){
    super()
  }
}