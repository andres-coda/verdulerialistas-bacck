import { Injectable, NotFoundException } from '@nestjs/common';
import { BaseService } from '../base/base.service';
import { Pedido } from './entity/Pedido.entity';
import { CrearPedido } from './dto/CrearPedido.dto';
import { EditarPedido } from './dto/EditarPedido.dto';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, FindOneOptions, QueryRunner, Repository } from 'typeorm';
import { ErroresService } from '../error/error.service';
import { ProveedorService } from '../proveedor/proveedor.service';
import { CreateProp, EditarPedidoProp, EditarProp, GetIdProp } from '../interface/serviceGeneric.interface';
import { Proveedor } from '../proveedor/entity/Proveedor.entity';
import { CrearPedidoProducto } from '../pedido_producto/dto/CrearPedidoProducto.dto';
import { PedidoProductoService } from '../pedido_producto/pedido_producto.service';

@Injectable()
export class PedidoService extends BaseService<Pedido, CrearPedido, EditarPedido> {
  constructor(
    @InjectRepository(Pedido) private readonly pedidoRepository: Repository<Pedido>,
    @InjectDataSource() private readonly dataSource: DataSource,
    protected readonly erroresService: ErroresService,
    private readonly proveedorService: ProveedorService,
    private readonly pedidoProdRepository: PedidoProductoService,
  ) {
    super(pedidoRepository, erroresService)
  }

  async getDatoByIdOrFail({ id, qR, userId }: GetIdProp<Pedido>): Promise<Pedido> {
    try {
      const criterio: FindOneOptions = {
        relations: ['pedidos_productos', 'pedidos_productos.producto', 'pedidos_productos.producto.rubro', 'proveedor', 'user'],
        select: {
          user: { id: true },
          proveedor: {
            id: true,
            nombre: true,
            telefono: true,
          }
        },
        where: {
          id: id,
          user: { id: userId }
        }
      }

      const pedido: Pedido | null = qR
        ? await qR.manager.findOne(Pedido, criterio)
        : await this.pedidoRepository.findOne(criterio)

      if (!pedido) throw new NotFoundException('No existe pedido')

      return pedido;
    } catch (error) {
      throw this.erroresService.handleExceptions(error, `Error al intentar leer el pedido con id ${id}`)
    }
  }

  async createDato({ user, dto }: CreateProp<CrearPedido>): Promise<Pedido> {
    const qR: QueryRunner = this.dataSource.createQueryRunner();
    await qR.connect();
    await qR.startTransaction();
    try {
      const newPedido: Pedido = await this.createDatoParcial({ user, dto, qR });

      for (const producto of dto.productos) {
        const newDto: CrearPedidoProducto = {
          producto: producto.producto,
          cantidad: producto.cantidad,
          pedido: newPedido,
        }

        await this.pedidoProdRepository.createDato({ user, dto: newDto, qR });
      }
      await qR.commitTransaction();
      return newPedido;
    } catch (er) {
      await qR.rollbackTransaction();
      throw this.erroresService.handleExceptions(er, `Error al intentar crear el pedido ${dto.fecha}`)
    } finally {
      await qR.release();
    }
  }

  async createDatoParcial({ user, dto, qR }: CreateProp<CrearPedido>): Promise<Pedido> {
    try {
      const proveedor: Proveedor = await this.proveedorService.getDatoByIdOrFail({ id: dto.proveedor, qR, entidadError: 'proveedor', userId: user.id })

      const pedido: Pedido = new Pedido();
      pedido.fecha = dto.fecha;
      pedido.estado = dto.estado || 'pendiente';
      pedido.proveedor = proveedor;
      pedido.user = user;

      const newPedido: Pedido = qR
        ? await qR.manager.save(Pedido, pedido)
        : await this.pedidoRepository.save(pedido);

      if (!newPedido) throw new NotFoundException("No se pudo crear el pedido");

      return newPedido;
    } catch (er) {
      throw this.erroresService.handleExceptions(er, `Error al intentar crear el pedido ${dto.fecha}`)
    }
  }

  async updateDato({ userId, dto, id, user }: EditarPedidoProp<EditarPedido>): Promise<Pedido> {
    const qR: QueryRunner = this.dataSource.createQueryRunner();
    await qR.connect();
    await qR.startTransaction();
    try {
      if (!dto.productos) throw new NotFoundException('La lista debe tener al menos un producto');
      
      const newPedido: Pedido = await this.updateDatoParcial({ userId, dto, id, qR });
      
      const productosAEliminar = newPedido.pedidos_productos.filter(np =>
        dto.productos && !dto.productos.some(dp => dp.producto === np.producto.id)
      );

      for (const producto of dto.productos) {
        const existe = newPedido.pedidos_productos.find(np => np.producto.id === producto.producto);
        if (existe && Number(existe?.cantidad) != Number(producto.cantidad)) {
          await this.pedidoProdRepository.updateDato({ userId, dto: producto, qR, id: existe.id })
          continue;
        }
        if(!existe) {
          const newDto: CrearPedidoProducto = {
            producto: producto.producto,
            cantidad: producto.cantidad,
            pedido: newPedido,
          }

          await this.pedidoProdRepository.createDato({ user, dto: newDto, qR });
        }
      }

      for (const prod of productosAEliminar) {
        await this.pedidoProdRepository.delet({ qR, id: prod.id, userId, entidadError:'productos del pedido' });
      }
      
      await qR.commitTransaction();
      return newPedido;
    } catch (er) {
      await qR.rollbackTransaction();
      throw this.erroresService.handleExceptions(er, `Error al intentar actualizar el pedido`)
    } finally {
      await qR.release();
    }
  }

  async updateDatoParcial({ userId, dto, qR, id }: EditarProp<EditarPedido>): Promise<Pedido> {
    try {
      const pedido: Pedido = await this.getDatoByIdOrFail({ id, userId, qR })

      const proveedor: Proveedor = dto.proveedor
        ? await this.proveedorService.getDatoByIdOrFail({ id: dto.proveedor, userId, qR, entidadError: 'proveedor' })
        : pedido.proveedor;

      pedido.fecha = dto.fecha || pedido.fecha;
      pedido.estado = dto.estado || pedido.estado;
      pedido.proveedor = proveedor;

      const newPedido: Pedido = qR
        ? await qR.manager.save(Pedido, pedido)
        : await this.pedidoRepository.save(pedido);

      if (!newPedido) throw new NotFoundException("No se pudo actualizar el pedido" + pedido.fecha);

      return { ...pedido, ...newPedido };
    } catch (er) {
      throw this.erroresService.handleExceptions(er, `Error al intentar actualizar el pedido`)
    }
  }

}
