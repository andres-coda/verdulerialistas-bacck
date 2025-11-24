import { Get, Param, HttpCode, UseGuards, Patch, Delete } from '@nestjs/common';
import { BaseService } from './base.service';
import { Base } from './entity/Base.entity';
import { UsuarioGuard } from '../auth/guard/user.guard';
import { AdminGuard } from '../auth/guard/admin.guard';
import { AuthParcialDto } from '../auth/dto/authParcial.dto';
import { UsuarioActual } from '../utils/usuarioActual.decorador';
import { DeletProp, GetIdProp } from '../interface/serviceGeneric.interface';
import { BaseDto } from './dto/BaseDto.dto';

export abstract class BaseController<T extends Base> {
  protected constructor(
    protected readonly baseService: BaseService<T, BaseDto, BaseDto>,
    private readonly entidadError?: string,
    private readonly relaciones?: (keyof T)[],
    private readonly  orden?: keyof T & string,
  ) {}

  @Get()
  @HttpCode(200)
  @UseGuards(UsuarioGuard, AdminGuard)
  async findAll(
    @UsuarioActual() usuario: AuthParcialDto,
  ): Promise<T[]> {
    return this.baseService.getDato({
      userId:usuario.sub, 
      entidadError:this.entidadError,
      relaciones: this.relaciones,
      orden: this.orden 
    });
  }

  @Get(':id')
  @HttpCode(200)
  @UseGuards(UsuarioGuard, AdminGuard)
  async findOne(
    @Param('id') id: string,
    @UsuarioActual() usuario: AuthParcialDto,
  ): Promise<T> {
    const item = await this.baseService.getDatoByIdOrFail({
      id, 
      userId:usuario.sub, 
      entidadError:this.entidadError,      
      relaciones: this.relaciones,
    });
    return item;
  }

  
  @Patch(':id/rehacer')
  @UseGuards(UsuarioGuard, AdminGuard)
  async undoDeleteConstante(
    @UsuarioActual() usuario: AuthParcialDto,
    @Param('id') id: string
  ): Promise<T> {
    const dto: GetIdProp<T> = {
      userId: usuario.sub,
      id,
      entidadError:this.entidadError
    }
    return await this.baseService.undoDelet(dto);
  }

  @Delete(':id')
  @UseGuards(UsuarioGuard, AdminGuard)
  async softDeleteConstante(
    @UsuarioActual() usuario: AuthParcialDto,
    @Param('id') id: string
  ): Promise<Boolean> {
    const dto: DeletProp<T> = {
      userId: usuario.sub,
      id,
      entidadError:this.entidadError
    }
    return await this.baseService.softDelet(dto);
  }

  @Delete(':id/eliminar')
  @UseGuards(UsuarioGuard, AdminGuard)
  async deleteConstante(
    @UsuarioActual() usuario: AuthParcialDto,
    @Param('id') id: string
  ): Promise<Boolean> {
    const dto: DeletProp<T> = {
      userId: usuario.sub,
      id,
      entidadError:this.entidadError
    }
    return await this.baseService.delet(dto);
  }
}
