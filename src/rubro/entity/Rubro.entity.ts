
import { Column, Entity, ManyToOne, OneToMany} from "typeorm";
import { Base } from "../../base/entity/Base.entity";
import { Producto } from "../../producto/entity/Producto.entity";

@Entity('rubro')
export class Rubro extends Base{
  @Column({ type: 'varchar', length: 50 })
  nombre!: string;

  @OneToMany(()=>Producto, prod=>prod.rubro)
  productos:Producto[];

  constructor(){
    super()
  }
}