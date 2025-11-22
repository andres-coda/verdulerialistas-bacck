import { forwardRef, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Base } from "./entity/Base.entity";
import { User } from "../user/entity/User.entity";
import { UserModule } from "../user/user.module";
import { ErroresModule } from "../error/error.module";
import { Producto } from "../producto/entity/Producto.entity";
import { Proveedor } from "../proveedor/entity/Proveedor.entity";
import { Rubro } from "../rubro/entity/Rubro.entity";

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Base,
      User,
      Producto,
      Proveedor,
      Rubro
    ]),
    forwardRef(() => UserModule),
    forwardRef(() => ErroresModule),
  ],
  controllers: [],
  providers: [],
  exports: []
})
export class BaseModule {}