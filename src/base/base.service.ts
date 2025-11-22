import { Injectable, NotFoundException } from '@nestjs/common';
import { Base } from './entity/Base.entity';
import { EntityTarget, FindManyOptions, FindOneOptions, Repository } from 'typeorm';
import { ErroresService } from '../error/error.service';
import { GetProp, GetIdProp, DeletProp, CreateProp, EditarProp, GetIdsProp } from '../interface/serviceGeneric.interface';
import { Producto } from '../producto/entity/Producto.entity';

@Injectable()
export abstract class BaseService<T extends Base, CrearDto, EditarDto> {
  protected constructor(
    protected readonly baseRepository: Repository<T>,
    protected readonly erroresService: ErroresService,
  ) { }

  abstract createDato({ user, dto, qR }: CreateProp<CrearDto>): Promise<T>;
  abstract updateDato({ userId, dto, qR, id }: EditarProp<EditarDto>): Promise<T>;

  async getDato({ qR, relaciones = [], entidadError = undefined, userId }: GetProp<T>): Promise<T[]> {
    try {
      const criterio: FindManyOptions = {
        relations: [...(relaciones as string[]), 'user'],
        select: {
          user: { id: true }
        },
        where: {
          deleted: false,
          user: { id: userId }
        } as any
      }
      if (qR) {
        const target: EntityTarget<T> = this.baseRepository.target;
        return await qR.manager.find<T>(target, criterio);
      }

      return await this.baseRepository.find(criterio);
    } catch (error) {
      throw this.erroresService.handleExceptions(error, `Error al intentar leer los datos ${entidadError && `de ${entidadError}`}`)
    }
  }

  async getDatoTodos({ qR, relaciones = [], entidadError = undefined, userId }: GetProp<T>): Promise<T[]> {
    try {
      const criterio: FindManyOptions = {
        relations: [...(relaciones as string[]), 'user'],
        select: {
          user: { id: true }
        },
        where: {
          user: { id: userId }
        } as any
      }
      if (qR) {
        const target: EntityTarget<T> = this.baseRepository.target;
        return await qR.manager.find<T>(target, criterio);
      }

      return await this.baseRepository.find(criterio);
    } catch (error) {
      throw this.erroresService.handleExceptions(error, `Error al intentar leer los datos ${entidadError && `de ${entidadError}`}`)
    }
  }

  async getDatosByIds({ids, entidadError, relaciones, qR, userId }:GetIdsProp<T>): Promise<T[]> {
    try {
      const datos:T[] = [];
      if(ids.length === 0) return datos;
      for(const id of ids){
        const dato:T = await this.getDatoByIdOrFail({id, qR, relaciones, entidadError, userId});
        datos.push(dato);
      }
      return datos;
    } catch (error) {
      throw this.erroresService.handleExceptions(error, `Error al intentar leer los datos ${entidadError && `de ${entidadError}`}`)
    }
  }

  async getDatoByIdOrFail({ id, qR, relaciones, entidadError, userId }: GetIdProp<T>): Promise<T> {

    try {
      const dato: T | null = await this.getDatoById({ id, qR, relaciones, entidadError, userId });
      if (!dato) throw new NotFoundException('No se encontro el dato en la base de datos');
      if (dato.deleted) throw new NotFoundException('El dato ha sido eliminado con anterioridad');
      return dato;
    } catch (error) {
      throw this.erroresService.handleExceptions(error, `Error al intentar leer el dato con id ${id} ${entidadError && `de ${entidadError}`}`)
    }
  }

  async getDatoById({ id, qR, relaciones = [], entidadError, userId }: GetIdProp<T>): Promise<T | null> {
    try {
      const criterio: FindOneOptions = {
        relations: [...(relaciones as string[]), 'user'],
        select: {
          user: { id: true }
        },
        where: {
          id: id,
          user: { id: userId }
        } as any
      }
      if (qR) {
        const target: EntityTarget<T> = this.baseRepository.target;
        return await qR.manager.findOne<T>(target, criterio);
      }

      return await this.baseRepository.findOne(criterio);
    } catch (error) {
      throw this.erroresService.handleExceptions(error, `Error al intentar leer el dato con id ${id} ${entidadError && `de ${entidadError}`}`)
    }
  }

  async softDelet({ id, qR, entidadError, userId }: DeletProp<T>): Promise<boolean> {
    try {
      const dato: T = await this.getDatoByIdOrFail({ id, qR, entidadError, userId });
      dato.deleted = true;

      const saved = qR
        ? await qR.manager.save<T>(dato)
        : await this.baseRepository.save(dato);

      if (!saved) throw new NotFoundException(`No se pudo eliminar el dato con id ${id}${entidadError ? ` de ${entidadError}` : ''}`);

      return true;
    } catch (error) {
      throw this.erroresService.handleExceptions(error, `Error en softDeleted de Base`)
    }
  }

  async undoDelet({ id, qR, entidadError, userId }: DeletProp<T>): Promise<T> {
    try {
      const dato: T | null = await this.getDatoById({ id, qR, entidadError, userId });
      if (!dato) throw new NotFoundException(`No existe dato con id ${id} en la base de datos`);
      if(!dato.deleted) return dato;
      
      dato.deleted = false;

      const saved: T = qR
        ? await qR.manager.save<T>(dato)
        : await this.baseRepository.save(dato);

      if (!saved) throw new NotFoundException(`No se pudo reactivar el dato con id ${id}${entidadError ? ` de ${entidadError}` : ''}`);

      return saved;
    } catch (error) {
      throw this.erroresService.handleExceptions(error, `Error en undoDeleted de Base`)
    }
  }

  async delet({ id, qR, entidadError, userId }: DeletProp<T>): Promise<boolean> {
    try {
      const dato: T = await this.getDatoByIdOrFail({ id, qR, entidadError, userId });

      const saved = qR
        ? await qR.manager.remove<T>(dato)
        : await this.baseRepository.remove(dato);

      if (!saved) throw new NotFoundException(`No se pudo eliminar el dato con id ${id}${entidadError ? ` de ${entidadError}` : ''}`);

      return true;
    } catch (error) {
      throw this.erroresService.handleExceptions(error, `Error en softDeleted de Base`)
    }
  }
}

