import { forwardRef, Module } from '@nestjs/common';
import { RubroController } from './rubro.controller';
import { RubroService } from './rubro.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Producto } from '../producto/entity/Producto.entity';
import { Rubro } from './entity/Rubro.entity';
import { AuthModule } from '../auth/auth.module';
import { UserModule } from '../user/user.module';
import { ErroresModule } from '../error/error.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Producto,
      Rubro,
    ]),
    forwardRef(() => AuthModule),
    forwardRef(() => UserModule),
    forwardRef(() => ErroresModule),
    forwardRef(() => RubroModule),
  ],
  controllers: [RubroController],
  providers: [RubroService],
  exports:[RubroService]
})
export class RubroModule {}
