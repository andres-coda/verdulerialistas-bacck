import { Body, Controller, Param, Post, Put } from '@nestjs/common';
import { User } from './entity/User.entity';
import { CrearUser } from './dto/CrearUser.dto';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) { }

  @Post()
  async createUsuario(@Body() datos: CrearUser): Promise<User> {
    return await this.userService.createUsuario({...datos});
  }

  @Put(':id')
  async editarUsuario(
    @Param('id') id: string,
    @Body() datos: CrearUser): Promise<User> {
    return await this.userService.updateUsuario(id,{...datos});
  }
}
