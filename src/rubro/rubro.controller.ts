import { Body, Controller, Get, HttpCode, Param, Post, Put, UseGuards } from '@nestjs/common';
import { BaseController } from '../base/base.controller';
import { Rubro } from './entity/Rubro.entity';
import { RubroService } from './rubro.service';
import { CrearRubro } from './dto/CrearRubro.dto';
import { EditarRubro } from './dto/EditarRubro.dto';
import { UsuarioGuard } from '../auth/guard/user.guard';
import { AdminGuard } from '../auth/guard/admin.guard';
import { UsuarioActual, UsuarioCompleto } from '../utils/usuarioActual.decorador';
import { User } from '../user/entity/User.entity';
import { CreateProp, EditarProp } from '../interface/serviceGeneric.interface';
import { AuthParcialDto } from '../auth/dto/authParcial.dto';

@Controller('rubro')
export class RubroController extends BaseController<Rubro> {
  constructor(
    private readonly rubroService: RubroService,
  ) {
    super(rubroService, "rubro")
  }

  @Get(':id')
    @HttpCode(200)
    @UseGuards(UsuarioGuard, AdminGuard)
    async findOne(
      @Param('id') id: string,
      @UsuarioActual() usuario: AuthParcialDto,
    ): Promise<Rubro> {
      const item = await this.rubroService.getDatoByIdOrFail({
        id, 
        userId:usuario.sub,      
      });
      return item;
    }

  @Post()
  @UseGuards(UsuarioGuard, AdminGuard)
  async createRubro(
    @UsuarioCompleto() user: User,
    @Body() datos: CrearRubro
  ): Promise<Rubro> {
    const dto: CreateProp<CrearRubro> = {
      dto: datos,
      user,
    }
    const rubro: Rubro = await this.rubroService.createDato(dto);
    return rubro;
  }

  @Put(':id')
  @UseGuards(UsuarioGuard, AdminGuard)
  async updeateRubro(
    @UsuarioActual() usuario: AuthParcialDto,
    @Param('id') id: string,
    @Body() datos: EditarRubro
  ): Promise<Rubro> {
    const dto: EditarProp<EditarRubro> = {
      dto: datos,
      userId:usuario.sub,
      id
    }
    const rubro: Rubro = await this.rubroService.updateDato(dto);
    return rubro;
  }
}
