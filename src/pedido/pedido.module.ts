import { forwardRef, Module } from '@nestjs/common';
import { PedidoController } from './pedido.controller';
import { PedidoService } from './pedido.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Pedido } from './entity/Pedido.entity';
import { Proveedor } from '../proveedor/entity/Proveedor.entity';
import { AuthModule } from '../auth/auth.module';
import { UserModule } from '../user/user.module';
import { ErroresModule } from '../error/error.module';
import { ProveedorModule } from '../proveedor/proveedor.module';
import { PedidoProducto } from '../pedido_producto/entity/PedidoProducto';
import { PedidoProductoModule } from '../pedido_producto/pedido_producto.module';

@Module({
  imports: [
      TypeOrmModule.forFeature([
        Pedido,
        Proveedor,
        PedidoProducto,
      ]),
      forwardRef(() => AuthModule),
      forwardRef(() => UserModule),
      forwardRef(() => ErroresModule),
      forwardRef(() => ProveedorModule),
      forwardRef(() => PedidoProductoModule),
    ],
  controllers: [PedidoController],
  providers: [PedidoService],
  exports: [PedidoService]
})
export class PedidoModule {}
