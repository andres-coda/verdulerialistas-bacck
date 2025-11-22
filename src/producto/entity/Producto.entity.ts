
import { Column, Entity, ManyToMany, ManyToOne, OneToMany} from "typeorm";
import { Base } from "../../base/entity/Base.entity";
import { Rubro } from "../../rubro/entity/Rubro.entity";
import { Proveedor } from "../../proveedor/entity/Proveedor.entity";
import { PedidoProducto } from "../../pedido_producto/entity/PedidoProducto";

@Entity('producto')
export class Producto extends Base{
  @Column({ type: 'varchar', length: 50 })
  nombre!: string;
  
  @Column({ type: 'varchar', length: 50 })
  unidad!: string;

  @ManyToOne(()=>Rubro, rubro=> rubro.productos )
  rubro:Rubro;

  @ManyToMany(()=>Proveedor, prov=> prov.productos)
  proveedores:Proveedor[];

  
  @OneToMany(()=>PedidoProducto, pedido => pedido.producto)
  pedidos_productos:PedidoProducto[];
  
  constructor(){
    super()
  }
}