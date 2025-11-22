import { forwardRef, Module } from '@nestjs/common';
import { ProveedorController } from './proveedor.controller';
import { ProveedorService } from './proveedor.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Producto } from '../producto/entity/Producto.entity';
import { Proveedor } from './entity/Proveedor.entity';
import { AuthModule } from '../auth/auth.module';
import { UserModule } from '../user/user.module';
import { ErroresModule } from '../error/error.module';
import { ProductoModule } from '../producto/producto.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Producto,
      Proveedor,
    ]),
    forwardRef(() => AuthModule),
    forwardRef(() => UserModule),
    forwardRef(() => ErroresModule),
    forwardRef(() => ProductoModule),
    forwardRef(() => ProveedorModule),
  ],
  controllers: [ProveedorController],
  providers: [ProveedorService],
  exports: [ProveedorService]
})
export class ProveedorModule {}
