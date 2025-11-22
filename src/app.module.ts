import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './user/user.module';
import { ErroresModule } from './error/error.module';
import { User } from './user/entity/User.entity';
import { RubroModule } from './rubro/rubro.module';
import { ProductoModule } from './producto/producto.module';
import { ProveedorModule } from './proveedor/proveedor.module';
import { Producto } from './producto/entity/Producto.entity';
import { Rubro } from './rubro/entity/Rubro.entity';
import { Proveedor } from './proveedor/entity/Proveedor.entity';
import { Base } from './base/entity/Base.entity';
import { BaseModule } from './base/base.module';
import { PedidoModule } from './pedido/pedido.module';
import { PedidoProductoModule } from './pedido_producto/pedido_producto.module';
import { PedidoProducto } from './pedido_producto/entity/PedidoProducto';
import { Pedido } from './pedido/entity/Pedido.entity';

@Module({
  imports: [
    ServeStaticModule.forRoot({ rootPath: join(__dirname, '..', 'client') }),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '3306', 10),
      username: process.env.DB_USERNAME || 'root',
      password: process.env.DB_PASSWORD || 'root',
      database: process.env.DB_NAME || 'backend_listas',
      ssl: false,
      entities: [
        Base,
        User,
        Producto,
        Rubro,
        Proveedor,
        PedidoProducto,
        Pedido
      ],
      synchronize: true,
      logging: false,
    }),
    UserModule,
    ErroresModule,
    RubroModule,
    ProductoModule,
    ProveedorModule,
    BaseModule,
    PedidoModule,
    PedidoProductoModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule { }
