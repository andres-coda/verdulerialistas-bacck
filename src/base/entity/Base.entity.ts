import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, TableInheritance, UpdateDateColumn } from "typeorm";
import { User } from "../../user/entity/User.entity";

@Entity('base')
@TableInheritance({ column: { type: 'varchar', name: 'tipo' } })
export abstract class Base {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @CreateDateColumn()
  fechaCreacion!: Date;

  @UpdateDateColumn()
  fechaActualizacion!: Date;
  
  @Column()
  deleted: boolean;

  @ManyToOne(()=>User, user=> user.bases)
  user:User;

  constructor() {
    this.deleted=false;
   }
}