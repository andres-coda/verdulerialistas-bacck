import { Body, Controller, Param, Post, Put, UseGuards } from '@nestjs/common';
import { Producto } from './entity/Producto.entity';
import { BaseController } from '../base/base.controller';
import { ProductoService } from './producto.service';
import { UsuarioGuard } from '../auth/guard/user.guard';
import { AdminGuard } from '../auth/guard/admin.guard';
import { UsuarioActual, UsuarioCompleto } from '../utils/usuarioActual.decorador';
import { User } from '../user/entity/User.entity';
import { CrearProducto } from './dto/CrearProducto.dto';
import { CreateProp, EditarProp } from '../interface/serviceGeneric.interface';
import { AuthParcialDto } from '../auth/dto/authParcial.dto';
import { EditarProducto } from './dto/EditarProducto.dto';

@Controller('producto')
export class ProductoController extends BaseController<Producto> {
  constructor(
    private readonly productoService: ProductoService,
  ) {
    super(productoService, "producto", ['rubro', 'proveedores'], 'nombre')
  }

  @Post()
  @UseGuards(UsuarioGuard, AdminGuard)
  async createRubro(
    @UsuarioCompleto() user: User,
    @Body() datos: CrearProducto
  ): Promise<Producto> {
    const dto: CreateProp<CrearProducto> = {
      dto: datos,
      user,
    }
    const producto: Producto = await this.productoService.createDato(dto);
    return producto;
  }

  @Put(':id')
  @UseGuards(UsuarioGuard, AdminGuard)
  async updeateRubro(
    @UsuarioActual() usuario: AuthParcialDto,
    @Param('id') id: string,
    @Body() datos: EditarProducto
  ): Promise<Producto> {
    const dto: EditarProp<EditarProducto> = {
      dto: datos,
      userId: usuario.sub,
      id
    }
    const producto: Producto = await this.productoService.updateDato(dto);
    return producto;
  }
}
