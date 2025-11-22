import { Base } from "../../base/entity/Base.entity";
import { Column, Entity, JoinTable, ManyToMany, OneToMany } from "typeorm";
import { Producto } from "../../producto/entity/Producto.entity";
import { Pedido } from "../../pedido/entity/Pedido.entity";

@Entity('proveedor')
export class Proveedor extends Base {
  @Column({ type: 'varchar', length: 50 })
  nombre!: string;

  @Column({ type: 'varchar', length: 20 })
  telefono!: string;

  @Column({ type: 'varchar', length: 255 })
  email!: string;

  @ManyToMany(() => Producto, prod => prod.proveedores)
  @JoinTable({
    name: 'prov_productos',
    joinColumn: {
      name: 'proveedorId',
      referencedColumnName: 'id'
    },
    inverseJoinColumn: {
      name: 'productoId',
      referencedColumnName: 'id'  
    }
  })
  productos: Producto[];

  @OneToMany(()=>Pedido, pedido => pedido.proveedor)
  pedidos:Pedido[];

  constructor(){
    super()
  }
}