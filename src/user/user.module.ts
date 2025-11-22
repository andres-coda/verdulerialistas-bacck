import { forwardRef, Module } from '@nestjs/common';
import { UserService } from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entity/User.entity';
import { Base } from '../base/entity/Base.entity';
import { AuthModule } from '../auth/auth.module';
import { ErroresModule } from '../error/error.module';
import { UserController } from './user.controller';
import { Producto } from '../producto/entity/Producto.entity';
import { Proveedor } from '../proveedor/entity/Proveedor.entity';
import { Rubro } from '../rubro/entity/Rubro.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      Producto,
      Proveedor,
      Rubro,
      Base
    ]),
    forwardRef(() => AuthModule),
    forwardRef(() => UserModule),
    forwardRef(() => ErroresModule),
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService]
})
export class UserModule { }
