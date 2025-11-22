import { Injectable, NotFoundException } from '@nestjs/common';
import { BaseService } from '../base/base.service';
import { Producto } from './entity/Producto.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOneOptions, Repository } from 'typeorm';
import { ErroresService } from '../error/error.service';
import { CreateProp, EditarProp, GetNameProp } from '../interface/serviceGeneric.interface';
import { CrearProducto } from './dto/CrearProducto.dto';
import { EditarProducto } from './dto/EditarProducto.dto';
import { RubroService } from '../rubro/rubro.service';
import { Rubro } from '../rubro/entity/Rubro.entity';

@Injectable()
export class ProductoService extends BaseService<Producto, CrearProducto, EditarProducto> {
  constructor(
    @InjectRepository(Producto) private readonly productoRepository: Repository<Producto>,
    protected readonly erroresService: ErroresService,
    private readonly rubroService: RubroService
  ) {
    super(productoRepository, erroresService)
  }

  async getDatoByName({ name, userId, qR }: GetNameProp<Producto>): Promise<Producto | null> {
    try {
      const criterio: FindOneOptions = {
        relations: ['user'],
        select: {
          user: { id: true }
        },
        where: {
          user: { id: userId },
          nombre: name,
        }
      }

      return qR
        ? await qR.manager.findOne(Producto, criterio)
        : await this.productoRepository.findOne(criterio);

    } catch (er) {
      throw this.erroresService.handleExceptions(er, `Error al intentar leer el producto ${name}`)
    }
  }
  
  async createDato({ user, dto, qR }: CreateProp<CrearProducto>): Promise<Producto> {
    try {
      const existe: Producto | null = await this.getDatoByName({ userId: user.id, name: dto.nombre, qR });
      if (existe) {
        return await this.undoDelet({id: existe.id, qR, entidadError:'producto', userId: user.id});
      }

      const rubro: Rubro = await this.rubroService.getDatoByIdOrFail({ id: dto.rubro, qR, entidadError: 'rubro', userId: user.id })

      const producto: Producto = new Producto();
      producto.nombre = dto.nombre;
      producto.unidad = dto.unidad;
      producto.rubro = rubro;
      producto.user = user;

      const newProducto: Producto = qR
        ? await qR.manager.save(Producto, producto)
        : await this.productoRepository.save(producto);

      if (!newProducto) throw new NotFoundException("No se pudo crear el producto");

      return newProducto;
    } catch (er) {
      throw this.erroresService.handleExceptions(er, `Error al intentar crear el producto ${dto.nombre}`)
    }
  }

  async updateDato({ userId, dto, qR, id }: EditarProp<EditarProducto>): Promise<Producto> {
    try {
      const producto: Producto = await this.getDatoByIdOrFail({ id, userId, qR, entidadError: 'producto', relaciones: ['rubro'] })

      const rubro: Rubro = dto.rubro
        ? await this.rubroService.getDatoByIdOrFail({ id: dto.rubro, userId, qR, entidadError: 'rubro' })
        : producto.rubro;

      producto.nombre = dto.nombre || producto.nombre;
      producto.unidad = dto.unidad || producto.unidad;
      producto.rubro = rubro;

      const newProducto: Producto = qR
        ? await qR.manager.save(Producto, producto)
        : await this.productoRepository.save(producto);

      if (!newProducto) throw new NotFoundException("No se pudo actualizar el producto" + producto.nombre);

      return newProducto;
    } catch (er) {
      throw this.erroresService.handleExceptions(er, `Error al intentar actualizar el producto`)
    }
  }
}
