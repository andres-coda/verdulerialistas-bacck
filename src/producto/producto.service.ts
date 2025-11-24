import { Injectable, NotFoundException } from '@nestjs/common';
import { BaseService } from '../base/base.service';
import { Producto } from './entity/Producto.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOneOptions, Repository } from 'typeorm';
import { ErroresService } from '../error/error.service';
import { CreateDefault, CreateProp, EditarProp, GetNameProp } from '../interface/serviceGeneric.interface';
import { CrearProducto } from './dto/CrearProducto.dto';
import { EditarProducto } from './dto/EditarProducto.dto';
import { RubroService } from '../rubro/rubro.service';
import { Rubro } from '../rubro/entity/Rubro.entity';
import { userDefault } from '../user/dto/userDefault';

interface ProductoDefault{
  nombre:string;
  unidad:string;
  rubroNombre:string;
}
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

      return {...newProducto, user: {...userDefault, id:user.id}};
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

   private productosDefault:ProductoDefault[] = [
    // Verduras de fruta
    { nombre: 'Tomate redondo', unidad: 'cajón', rubroNombre: 'Verduras de fruta' },
    { nombre: 'Morrón Rojo', unidad: 'cajón', rubroNombre: 'Verduras de fruta' },
    { nombre: 'Berenjena', unidad: 'cajón', rubroNombre: 'Verduras de fruta' },
    { nombre: 'Zapallito', unidad: 'cajón', rubroNombre: 'Verduras de fruta' },
    { nombre: 'Tomate perita', unidad: 'cajón', rubroNombre: 'Verduras de fruta' },
    { nombre: 'Tomate cherry', unidad: 'cajón', rubroNombre: 'Verduras de fruta' },
    { nombre: 'Morrón Verde', unidad: 'cajón', rubroNombre: 'Verduras de fruta' },
    { nombre: 'Morrón Amarillo', unidad: 'cajón', rubroNombre: 'Verduras de fruta' },
    { nombre: 'Pepino', unidad: 'cajón', rubroNombre: 'Verduras de fruta' },
    
    // Verduras de hoja
    { nombre: 'Lechuga Manteca', unidad: 'jaula', rubroNombre: 'Verduras de hoja' },
    { nombre: 'Lechuga Criolla', unidad: 'jaula', rubroNombre: 'Verduras de hoja' },
    { nombre: 'Lechuga Francesa', unidad: 'cajón', rubroNombre: 'Verduras de hoja' },
    { nombre: 'Lechuga Morada', unidad: 'cajón', rubroNombre: 'Verduras de hoja' },
    { nombre: 'Acelga', unidad: 'jaula', rubroNombre: 'Verduras de hoja' },
    { nombre: 'Espinaca', unidad: 'jaula', rubroNombre: 'Verduras de hoja' },
    
    // Bolsas
    { nombre: 'Cebolla', unidad: 'bolsa', rubroNombre: 'Bolsas' },
    { nombre: 'Papa negra', unidad: 'bolsa', rubroNombre: 'Bolsas' },
    { nombre: 'Papa blanca', unidad: 'bolsa', rubroNombre: 'Bolsas' },
    { nombre: 'Zanahoria', unidad: 'bolsa', rubroNombre: 'Bolsas' },
    { nombre: 'Calabaza', unidad: 'bolsa', rubroNombre: 'Bolsas' },

    // Frutas
    { nombre: 'Manzana Roja', unidad: 'caja', rubroNombre: 'Frutas' },
    { nombre: 'Manzana Verde', unidad: 'caja', rubroNombre: 'Frutas' },
    { nombre: 'Banana de Ecuador', unidad: 'caja', rubroNombre: 'Frutas' },
    { nombre: 'Pera Paka', unidad: 'caja', rubroNombre: 'Frutas' },
    { nombre: 'Pera Willams', unidad: 'caja', rubroNombre: 'Frutas' },
    { nombre: 'Durazno', unidad: 'cajón', rubroNombre: 'Frutas' },
    { nombre: 'Pelón', unidad: 'cajón', rubroNombre: 'Frutas' },
    { nombre: 'Damasco', unidad: 'cajón', rubroNombre: 'Frutas' },
    { nombre: 'Ciruela', unidad: 'cajón', rubroNombre: 'Frutas' },
    
    // Citricos
    { nombre: 'Naranja de jugo', unidad: 'cajón', rubroNombre: 'Citrico' },
    { nombre: 'Naranja de ombligo', unidad: 'cajón', rubroNombre: 'Citrico' },
    { nombre: 'Mandarina', unidad: 'cajón', rubroNombre: 'Citrico' },
    { nombre: 'Pomelo', unidad: 'cajón', rubroNombre: 'Citrico' },
  ];

  async crearProductosDefault({ user, qR }: CreateDefault<CrearProducto>): Promise<Producto[]> {
      try {
        const productos: Producto[] = [];
        for (const dato of this.productosDefault) {
          let rubro:Rubro | null= await this.rubroService.getDatoByName({name:dato.rubroNombre, qR, userId:user.id})
          if(!rubro) {
            rubro = await this.rubroService.createDato({user, dto:{nombre:dato.rubroNombre}, qR});
          }

          const dto:CrearProducto = {
            ...dato,
            rubro:rubro.id
          }
          const producto:Producto = await this.createDato({user, dto, qR});

          productos.push(producto)
        }
        return productos;
      } catch (error) {
        throw this.erroresService.handleExceptions(error, `Error al intentar crear rubros por default`)
      }
    }
}
