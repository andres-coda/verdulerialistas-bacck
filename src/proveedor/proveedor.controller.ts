import { Body, Controller, Get, HttpCode, Param, Patch, Post, Put, UseGuards } from '@nestjs/common';
import { BaseController } from '../base/base.controller';
import { UsuarioGuard } from '../auth/guard/user.guard';
import { AdminGuard } from '../auth/guard/admin.guard';
import { UsuarioActual, UsuarioCompleto } from '../utils/usuarioActual.decorador';
import { User } from '../user/entity/User.entity';
import { AddDatoProp, CreateProp, EditarProp } from '../interface/serviceGeneric.interface';
import { AuthParcialDto } from '../auth/dto/authParcial.dto';
import { Proveedor } from './entity/Proveedor.entity';
import { ProveedorService } from './proveedor.service';
import { CrearProveedor } from './dto/CrearProveedor.dto';
import { EditarProveedor } from './dto/EditarProveedor.dto';
import { AddProductoProveedor } from './dto/AddProducto.dto';

@Controller('proveedor')
export class ProveedorController extends BaseController<Proveedor> {
  constructor(
    private readonly proveedorService: ProveedorService,
  ) {
    super(proveedorService, "proveedor", ['productos', 'pedidos'])
  }

  @Get(':id')
    @HttpCode(200)
    @UseGuards(UsuarioGuard, AdminGuard)
    async findOne(
      @Param('id') id: string,
      @UsuarioActual() usuario: AuthParcialDto,
    ): Promise<Proveedor> {
      const item = await this.proveedorService.getDatoByIdOrFail({
        id, 
        userId:usuario.sub, 
      });
      return item;
    }

  @Post()
  @UseGuards(UsuarioGuard, AdminGuard)
  async createRubro(
    @UsuarioCompleto() user: User,
    @Body() datos: CrearProveedor
  ): Promise<Proveedor> {
    const dto: CreateProp<CrearProveedor> = {
      dto: datos,
      user,
    }
    const proveedor: Proveedor = await this.proveedorService.createDato(dto);
    return proveedor;
  }

  @Put(':id')
  @UseGuards(UsuarioGuard, AdminGuard)
  async updeateRubro(
    @UsuarioActual() usuario: AuthParcialDto,
    @Param('id') id: string,
    @Body() datos: EditarProveedor
  ): Promise<Proveedor> {
    const dto: EditarProp<EditarProveedor> = {
      dto: datos,
      userId: usuario.sub,
      id
    }
    const proveedor: Proveedor = await this.proveedorService.updateDato(dto);
    return proveedor;
  }

  @Patch('/add-producto/:id')
  @UseGuards(UsuarioGuard, AdminGuard)
  async addProducto(
    @UsuarioActual() usuario: AuthParcialDto,
    @Param('id') id: string,
    @Body() datos: AddProductoProveedor
  ): Promise<Proveedor> {
    const dto: AddDatoProp<Proveedor> = {
      datos: datos.productos,
      userId: usuario.sub,
      id
    }
    const proveedor: Proveedor = await this.proveedorService.addProducto(dto);
    return proveedor;
  }

  @Patch('/substract-producto/:id')
  @UseGuards(UsuarioGuard, AdminGuard)
  async substractProducto(
    @UsuarioActual() usuario: AuthParcialDto,
    @Param('id') id: string,
    @Body() datos: AddProductoProveedor
  ): Promise<Proveedor> {
    const dto: AddDatoProp<Proveedor> = {
      datos: datos.productos,
      userId: usuario.sub,
      id
    }
    const proveedor: Proveedor = await this.proveedorService.substractProducto(dto);
    return proveedor;
  }
}
