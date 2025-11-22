import { forwardRef, Module } from '@nestjs/common';
import { PedidoProductoController } from './pedido_producto.controller';
import { PedidoProductoService } from './pedido_producto.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Pedido } from '../pedido/entity/Pedido.entity';
import { Producto } from '../producto/entity/Producto.entity';
import { PedidoProducto } from './entity/PedidoProducto';
import { AuthModule } from '../auth/auth.module';
import { UserModule } from '../user/user.module';
import { ErroresModule } from '../error/error.module';
import { ProductoModule } from '../producto/producto.module';

@Module({
  imports: [
      TypeOrmModule.forFeature([
        Pedido,
        Producto,
        PedidoProducto
      ]),
      forwardRef(() => AuthModule),
      forwardRef(() => UserModule),
      forwardRef(() => ErroresModule),
      forwardRef(() => ProductoModule),
    ],
  controllers: [PedidoProductoController],
  providers: [PedidoProductoService],
  exports: [PedidoProductoService]
})
export class PedidoProductoModule {}
