import { createParamDecorator, ExecutionContext, NotFoundException } from '@nestjs/common';
import { AuthParcialDto } from '../auth/dto/authParcial.dto';
import { User } from '../user/entity/User.entity';

export const UsuarioActual = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
     if (ctx.getType() !== 'http') throw new NotFoundException('No se encontro contexto para la peticion http');
    const request = ctx.switchToHttp().getRequest();
    const usuario: AuthParcialDto = request.user;
    return usuario;
  },
);

export const UsuarioCompleto = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    if (ctx.getType() !== 'http') {
      throw new NotFoundException('No se encontró contexto para la petición http');
    }
    const request = ctx.switchToHttp().getRequest();
    const usuario: User = request.usuarioCompleto;
    return usuario;
  },
);