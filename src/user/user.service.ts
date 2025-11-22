import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entity/User.entity';
import { FindOneOptions, Repository } from 'typeorm';
import { ErroresService } from '../error/error.service';
import { CrearUser } from './dto/CrearUser.dto';
import { Role } from '../auth/rol/rol.enum';

interface PropGetId{
  id:string;
}

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly usuarioRepository: Repository<User>,
    private readonly erroresService: ErroresService,
  ) {}

  async getDatoByIdOrFail({id}:PropGetId):Promise<User>{
    try{
      const criterio:FindOneOptions={
        where:{
          id:id
        }
      }

      const user:User | null= await this.usuarioRepository.findOne(criterio);
      if(!user) throw new NotFoundException("No existe usuario con el id "+id);
      return user;
    } catch(er){
      throw this.erroresService.handleExceptions(er, `No se encontro el usuario ${id}`)
    }
  }

  async getUsuarioByEmail(email: string): Promise<User> {
    try {
      const criterio: FindOneOptions = {
        where: {
          email: email,
        }
      }
      const newUser: User | null = await this.usuarioRepository.findOne(criterio);
      if (!newUser) throw new NotFoundException(`No se encontro el usuario ${email}`);

      return newUser;
    } catch (error) {
      throw this.erroresService.handleExceptions(error, `No se encontro el usuario ${email}`)
    }
  }

  async createUsuario(datos: CrearUser): Promise<User> {
    try {
      const usuario: User = new User();
      usuario.nombre = datos.nombre;
      usuario.email = datos.email;
      usuario.password = datos.password;
      usuario.telefono = datos.telefono;
      usuario.role = datos.role || 'user';

      const newUsuario: User = await this.usuarioRepository.save(usuario);
      if (!newUsuario) throw new NotFoundException(`Error al intentar crear el dato ${datos.nombre} en usuario`)
      return newUsuario;
    } catch (error) {
      throw this.erroresService.handleExceptions(error, `Error al intentar crear el dato ${datos.nombre} en usuario`)
    }
  }

  async updateUsuario(id: string, datos: CrearUser): Promise<User> {
    try {
      const usuario: User = await this.getDatoByIdOrFail({id});
      usuario.nombre = datos.nombre;
      usuario.email = datos.email;
      usuario.password = datos.password;

      return await this.usuarioRepository.save(usuario);
    } catch (error) {
      throw this.erroresService.handleExceptions(error, `Error al intentar actualizar el dato con ${id} de usuario`)
    }
  }

  async modifyUsuarioRole(id: string, role: Role): Promise<User> {
    try {
      const usuario: User = await this.getDatoByIdOrFail({id});
      usuario.role = role;

      return await this.usuarioRepository.save(usuario);
    } catch (error) {
      throw this.erroresService.handleExceptions(error, `Error al intentar modificar el rol al usuario ${id}`)
    }
  }

}
