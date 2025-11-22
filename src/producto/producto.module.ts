import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Rubro } from '../rubro/entity/Rubro.entity';
import { Producto } from './entity/Producto.entity';
import { AuthModule } from '../auth/auth.module';
import { UserModule } from '../user/user.module';
import { ErroresModule } from '../error/error.module';
import { RubroModule } from '../rubro/rubro.module';
import { ProductoService } from './producto.service';
import { Proveedor } from '../proveedor/entity/Proveedor.entity';
import { ProveedorModule } from '../proveedor/proveedor.module';
import { ProductoController } from './producto.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Producto,
      Rubro,
      Proveedor,
    ]),
    forwardRef(() => AuthModule),
    forwardRef(() => UserModule),
    forwardRef(() => ErroresModule),
    forwardRef(() => RubroModule),
    forwardRef(() => ProveedorModule),
  ],
  controllers: [ProductoController],
  providers: [ProductoService],
  exports: [ProductoService]
})
export class ProductoModule {}
