import { Injectable, NotFoundException } from '@nestjs/common';
import { BaseService } from '../base/base.service';
import { PedidoProducto } from './entity/PedidoProducto';
import { CrearPedidoProducto } from './dto/CrearPedidoProducto.dto';
import { EditarPedidoProducto } from './dto/EditarPedidoProducto.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ErroresService } from '../error/error.service';
import { CreateProp, EditarProp } from '../interface/serviceGeneric.interface';
import { Producto } from '../producto/entity/Producto.entity';
import { ProductoService } from '../producto/producto.service';

@Injectable()
export class PedidoProductoService extends BaseService<PedidoProducto, CrearPedidoProducto, EditarPedidoProducto> {
  constructor(
    @InjectRepository(PedidoProducto) private readonly pedidoProductoRepository: Repository<PedidoProducto>,
    private readonly productoService: ProductoService,
    protected readonly erroresService: ErroresService,
  ) {
    super(pedidoProductoRepository, erroresService)
  }

  async createDato({ user, dto, qR }: CreateProp<CrearPedidoProducto>): Promise<PedidoProducto> {
    try {
      const producto: Producto = await this.productoService.getDatoByIdOrFail({ id: dto.producto, qR, entidadError: 'producto', userId: user.id });

      const pedProd: PedidoProducto = new PedidoProducto();
      pedProd.cantidad = dto.cantidad;
      pedProd.pedido = dto.pedido;
      pedProd.producto = producto;
      pedProd.user = user;
    
      const newPedProd: PedidoProducto = qR
        ? await qR.manager.save(PedidoProducto, pedProd)
        : await this.pedidoProductoRepository.save(pedProd);

      if (!newPedProd) throw new NotFoundException("No se pudo crear el producto del pedido");
   
      return newPedProd;
    } catch (er) {
      throw this.erroresService.handleExceptions(er, `Error al intentar crear el pedido del producto ${dto.cantidad}`)
    }
  }

  async updateDato({ userId, dto, qR, id }: EditarProp<EditarPedidoProducto>): Promise<PedidoProducto> {
    try {
      const pedProd: PedidoProducto = await this.getDatoByIdOrFail({ id, userId, qR, entidadError: 'producto del pedido'})

      pedProd.cantidad = dto.cantidad;

      const newPedProd: PedidoProducto = qR
        ? await qR.manager.save(PedidoProducto, pedProd)
        : await this.pedidoProductoRepository.save(pedProd);

      if (!newPedProd) throw new NotFoundException("No se pudo actualizar el producto del pedido" + pedProd.cantidad);

      return newPedProd;
    } catch (er) {
      throw this.erroresService.handleExceptions(er, `Error al intentar actualizar el producto del pedido`)
    }
  }
}
