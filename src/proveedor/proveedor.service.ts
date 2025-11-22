import { Injectable, NotFoundException } from '@nestjs/common';
import { BaseService } from '../base/base.service';
import { Proveedor } from './entity/Proveedor.entity';
import { CrearProveedor } from './dto/CrearProveedor.dto';
import { EditarProveedor } from './dto/EditarProveedor.dto';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, FindOneOptions, QueryRunner, Repository } from 'typeorm';
import { ErroresService } from '../error/error.service';
import { ProductoService } from '../producto/producto.service';
import { AddDatoProp, CreateProp, EditarProp, GetIdProp, GetNameProp } from '../interface/serviceGeneric.interface';
import { Producto } from '../producto/entity/Producto.entity';

@Injectable()
export class ProveedorService extends BaseService<Proveedor, CrearProveedor, EditarProveedor> {
  constructor(
    @InjectRepository(Proveedor) private readonly proveedorRepository: Repository<Proveedor>,
    @InjectDataSource() private readonly dataSource: DataSource,
    protected readonly erroresService: ErroresService,
    private readonly productoService: ProductoService
  ) {
    super(proveedorRepository, erroresService)
  }

  async getDatoByIdOrFail({ id, userId, qR }: GetIdProp<Proveedor>): Promise<Proveedor> {
    try {
      const criterio: FindOneOptions = {
        relations: ['user', 'productos', 'productos.rubro', 'pedidos', 'pedidos.pedidos_productos'],
        select: {
          user: { id: true }
        },
        where: {
          user: { id: userId },
          id: id,
        }
      }

      const proveedor: Proveedor | null = qR
        ? await qR.manager.findOne(Proveedor, criterio)
        : await this.proveedorRepository.findOne(criterio);
      if (!proveedor) throw new NotFoundException('No se encontro el proveedor con id ' + id);

      return proveedor;
    } catch (er) {
      throw this.erroresService.handleExceptions(er, `Error al intentar leer el proveedor ${id}`)
    }
  }

  async getDatoByName({ name, userId, qR }: GetNameProp<Proveedor>): Promise<Proveedor | null> {
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
        ? await qR.manager.findOne(Proveedor, criterio)
        : await this.proveedorRepository.findOne(criterio);

    } catch (er) {
      throw this.erroresService.handleExceptions(er, `Error al intentar leer el proveedor ${name}`)
    }
  }

  async createDato({ user, dto }: CreateProp<CrearProveedor>): Promise<Proveedor> {
    const qR: QueryRunner = this.dataSource.createQueryRunner();
    await qR.connect();
    await qR.startTransaction();
    try {
      const newProveedor: Proveedor = await this.createDatoParcial({ user, dto, qR });

      await qR.commitTransaction();
      return newProveedor;
    } catch (er) {
      await qR.rollbackTransaction();
      throw this.erroresService.handleExceptions(er, `Error al intentar crear el proveedor ${dto.nombre}`)
    } finally {
      await qR.release();
    }
  }

  async createDatoParcial({ user, dto, qR }: CreateProp<CrearProveedor>): Promise<Proveedor> {
    try {
      const existe: Proveedor | null = await this.getDatoByName({ userId: user.id, name: dto.nombre, qR });
      if (existe) return existe;

      const productos: Producto[] = await this.productoService.getDatosByIds({ ids: dto.productos, qR, entidadError: 'producto', userId: user.id })

      const proveedor: Proveedor = new Proveedor();
      proveedor.nombre = dto.nombre;
      proveedor.telefono = dto.telefono;
      proveedor.email = dto.email;
      proveedor.productos = productos;
      proveedor.user = user;

      const newProveedor: Proveedor = qR
        ? await qR.manager.save(Proveedor, proveedor)
        : await this.proveedorRepository.save(proveedor);

      if (!newProveedor) throw new NotFoundException("No se pudo crear el proveedor");

      return newProveedor;
    } catch (er) {
      throw this.erroresService.handleExceptions(er, `Error al intentar crear el proveedor ${dto.nombre}`)
    }
  }

  async updateDato({ userId, dto, qR, id }: EditarProp<EditarProveedor>): Promise<Proveedor> {
    try {
      const proveedor: Proveedor = await this.getDatoByIdOrFail({ id, userId, qR, entidadError: 'proveedor', relaciones: ['productos'] })

      const productos: Producto[] = dto.productos
        ? await this.productoService.getDatosByIds({
          ids: dto.productos,
          entidadError: 'productos',
          userId,
          qR
        })
        : [];
        
      proveedor.nombre = dto.nombre || proveedor.nombre;
      proveedor.telefono = dto.telefono || proveedor.telefono;
      proveedor.email = dto.email || proveedor.email;
      proveedor.productos = productos;

      const newProveedor: Proveedor = qR
        ? await qR.manager.save(Proveedor, proveedor)
        : await this.proveedorRepository.save(proveedor);

      if (!newProveedor) throw new NotFoundException("No se pudo actualizar el proveedor" + proveedor.nombre);

      return newProveedor;
    } catch (er) {
      throw this.erroresService.handleExceptions(er, `Error al intentar actualizar el proveedor`)
    }
  }

  async addProducto({ datos, id, qR, userId }: AddDatoProp<Proveedor>): Promise<Proveedor> {
    try {
      const productos: Producto[] = await this.productoService.getDatosByIds({ ids: datos, qR, entidadError: 'producto', userId })
      const proveedor: Proveedor = await this.getDatoByIdOrFail({ id, userId, qR, entidadError: 'proveedor', relaciones: ['productos'] })
      if (productos.length === 0) return proveedor;

      const newProductos: Producto[] = proveedor.productos.filter(p => !datos.includes(p.id));
      proveedor.productos = [...newProductos, ...productos];

      return qR
        ? qR.manager.save(Proveedor, proveedor)
        : this.proveedorRepository.save(proveedor);

    } catch (er) {
      throw this.erroresService.handleExceptions(er, `Error al intentar agregar productos al proveedor`)
    }
  }

  async substractProducto({ datos, id, qR, userId }: AddDatoProp<Proveedor>): Promise<Proveedor> {
    try {
      const proveedor: Proveedor = await this.getDatoByIdOrFail({ id, userId, qR, entidadError: 'proveedor', relaciones: ['productos'] })
      if (datos.length === 0) return proveedor;

      const newProductos: Producto[] = proveedor.productos.filter(p => !datos.includes(p.id));

      proveedor.productos = newProductos;

      return qR
        ? qR.manager.save(Proveedor, proveedor)
        : this.proveedorRepository.save(proveedor);

    } catch (er) {
      throw this.erroresService.handleExceptions(er, `Error al intentar quitar productos al proveedor`)
    }
  }
}
