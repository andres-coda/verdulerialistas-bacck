import { BaseService } from '../base/base.service';
import { Rubro } from './entity/Rubro.entity';
import { Injectable, NotFoundException } from '@nestjs/common';
import { FindOneOptions, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ErroresService } from '../error/error.service';
import { CreateProp, EditarProp, GetIdProp, GetNameProp } from '../interface/serviceGeneric.interface';
import { CrearRubro } from './dto/CrearRubro.dto';
import { EditarRubro } from './dto/EditarRubro.dto';


@Injectable()
export class RubroService extends BaseService<Rubro, CrearRubro, EditarRubro> {
  constructor(
    @InjectRepository(Rubro) private readonly rubroRepository: Repository<Rubro>,
    protected readonly erroresService: ErroresService
  ) {
    super(rubroRepository, erroresService)
  }

  async getDatoByIdOrFail({ id, userId, qR }: GetIdProp<Rubro>): Promise<Rubro> {
    try {
      const criterio: FindOneOptions = {
        relations: ['user', 'productos', 'productos.proveedores'],
        select: {
          user: { id: true }
        },
        where: {
          user: { id: userId },
          id: id,
        }
      }

      const rubro: Rubro | null = qR
        ? await qR.manager.findOne(Rubro, criterio)
        : await this.rubroRepository.findOne(criterio);

      if (!rubro) throw new NotFoundException('Error al intentar leer el rubro id ' + id)

      return rubro;
    } catch (er) {
      throw this.erroresService.handleExceptions(er, `Error al intentar leer el rubro ${id}`)
    }
  }

  async getDatoByName({ name, userId, qR }: GetNameProp<Rubro>): Promise<Rubro | null> {
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
        ? await qR.manager.findOne(Rubro, criterio)
        : await this.rubroRepository.findOne(criterio);

    } catch (er) {
      throw this.erroresService.handleExceptions(er, `Error al intentar leer el rubro ${name}`)
    }
  }

  async createDato({ user, dto, qR }: CreateProp<CrearRubro>): Promise<Rubro> {
    try {
      const existe: Rubro | null = await this.getDatoByName({ userId: user.id, name: dto.nombre, qR });
      if (existe) return existe;

      const rubro: Rubro = new Rubro();
      rubro.nombre = dto.nombre;
      rubro.user = user;

      const newRubro: Rubro = qR
        ? await qR.manager.save(Rubro, rubro)
        : await this.rubroRepository.save(rubro);

      if (!newRubro) throw new NotFoundException("No se pudo crear el rubro");

      return newRubro;
    } catch (er) {
      throw this.erroresService.handleExceptions(er, `Error al intentar crear el rubro ${dto.nombre}`)
    }
  }

  async updateDato({ userId, dto, qR, id }: EditarProp<EditarRubro>): Promise<Rubro> {
    try {
      const rubro: Rubro = await this.getDatoByIdOrFail({ id, userId, qR, entidadError: 'rubro' });

      rubro.nombre = dto.nombre || rubro.nombre;

      const newRubro: Rubro = qR
        ? await qR.manager.save(Rubro, rubro)
        : await this.rubroRepository.save(rubro);

      if (!newRubro) throw new NotFoundException("No se pudo actualizar el rubro");

      return newRubro;
    } catch (er) {
      throw this.erroresService.handleExceptions(er, `Error al intentar actualizar el rubro`)
    }
  }
}
