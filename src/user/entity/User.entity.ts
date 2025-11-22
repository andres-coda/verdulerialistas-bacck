
import { Column, Entity, OneToMany, PrimaryGeneratedColumn, Unique } from "typeorm";
import { Role } from "../../auth/rol/rol.enum";
import { Base } from "../../base/entity/Base.entity";

@Entity('usuario')
@Unique(['email'])
export class User{
  @PrimaryGeneratedColumn('uuid')
  id:string;

  @Column({ type: 'varchar', length: 100 })
  nombre: string;

  @Column({ type: 'varchar', length: 20 })
  telefono: string;

  @Column({ type: 'varchar' })
  password: string;

  @Column({ type: 'varchar', length: 255 })
  email: string;

  @Column({ type: 'enum', enum: Role, default: Role.User })
  role: string;

  @OneToMany(()=>Base, base=> base.user)
  bases:Base[];

  constructor() {
  }
}