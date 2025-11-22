import { Body, Controller, Param, Post, Put, UseGuards } from '@nestjs/common';
import { PedidoProducto } from './entity/PedidoProducto';
import { BaseController } from '../base/base.controller';
import { PedidoProductoService } from './pedido_producto.service';
import { UsuarioGuard } from '../auth/guard/user.guard';
import { AdminGuard } from '../auth/guard/admin.guard';
import { UsuarioActual, UsuarioCompleto } from '../utils/usuarioActual.decorador';
import { User } from '../user/entity/User.entity';
import { CrearPedidoProducto } from './dto/CrearPedidoProducto.dto';
import { CreateProp, EditarProp } from '../interface/serviceGeneric.interface';
import { AuthParcialDto } from '../auth/dto/authParcial.dto';
import { EditarPedidoProducto } from './dto/EditarPedidoProducto.dto';

@Controller('pedido-producto')
export class PedidoProductoController extends BaseController<PedidoProducto> {
  constructor(
    private readonly pedidoProdService: PedidoProductoService,
  ) {
    super(pedidoProdService, "producto del pedido", ['pedido', 'producto'])
  }

  @Post()
  @UseGuards(UsuarioGuard, AdminGuard)
  async createRubro(
    @UsuarioCompleto() user: User,
    @Body() datos: CrearPedidoProducto
  ): Promise<PedidoProducto> {
    const dto: CreateProp<CrearPedidoProducto> = {
      dto: datos,
      user,
    }
    const pedProd: PedidoProducto = await this.pedidoProdService.createDato(dto);
    return pedProd;
  }

  @Put(':id')
  @UseGuards(UsuarioGuard, AdminGuard)
  async updeateRubro(
    @UsuarioActual() usuario: AuthParcialDto,
    @Param('id') id: string,
    @Body() datos: EditarPedidoProducto
  ): Promise<PedidoProducto> {
    const dto: EditarProp<EditarPedidoProducto> = {
      dto: datos,
      userId: usuario.sub,
      id
    }
    const pedProd: PedidoProducto = await this.pedidoProdService.updateDato(dto);
    return pedProd;
  }
}
