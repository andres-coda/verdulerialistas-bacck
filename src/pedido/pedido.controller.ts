import { Body, Controller, Get, HttpCode, Param, Post, Put, UseGuards } from '@nestjs/common';
import { PedidoService } from './pedido.service';
import { BaseController } from '../base/base.controller';
import { Pedido } from './entity/Pedido.entity';
import { AdminGuard } from '../auth/guard/admin.guard';
import { UsuarioGuard } from '../auth/guard/user.guard';
import { UsuarioActual, UsuarioCompleto } from '../utils/usuarioActual.decorador';
import { User } from '../user/entity/User.entity';
import { CrearPedido } from './dto/CrearPedido.dto';
import { CreateProp, EditarPedidoProp, EditarProp } from '../interface/serviceGeneric.interface';
import { AuthParcialDto } from '../auth/dto/authParcial.dto';
import { EditarPedido } from './dto/EditarPedido.dto';

@Controller('pedido')
export class PedidoController extends BaseController<Pedido> {
  constructor(
    private readonly pedidoService: PedidoService,
  ) {
    super(pedidoService, "pedido", ['proveedor'])
  }

  @Get(':id')
  @HttpCode(200)
  @UseGuards(UsuarioGuard, AdminGuard)
  async findOne(
    @Param('id') id: string,
    @UsuarioActual() usuario: AuthParcialDto,
  ): Promise<Pedido> {
    const item = await this.pedidoService.getDatoByIdOrFail({
      id,
      userId: usuario.sub,
    });
    return item;
  }

  @Post()
  @UseGuards(UsuarioGuard, AdminGuard)
  async createRubro(
    @UsuarioCompleto() user: User,
    @Body() datos: CrearPedido
  ): Promise<Pedido> {
    const dto: CreateProp<CrearPedido> = {
      dto: datos,
      user,
    }
    const pedido: Pedido = await this.pedidoService.createDato(dto);
    return pedido;
  }

  @Put(':id')
  @UseGuards(UsuarioGuard, AdminGuard)
  async updeateRubro(
    @UsuarioCompleto() user: User,
    @Param('id') id: string,
    @Body() datos: EditarPedido
  ): Promise<Pedido> {
    const dto: EditarPedidoProp<EditarPedido> = {
      dto: datos,
      userId: user.id,
      id,
      user:user
    }
    const pedido: Pedido = await this.pedidoService.updateDato(dto);
    return pedido;
  }
}
