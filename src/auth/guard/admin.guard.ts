import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { jwtConstants } from "../constants";
import { Role } from "../rol/rol.enum";
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class AdminGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);

    if (!token) {
      throw new UnauthorizedException('No tiene autorización para acceder');
    }

    const payload = this.jwtService.verify(token, { secret: jwtConstants.secret });

    // VALIDAR EL ROL
    if (payload.role !== Role.Admin) {
      throw new UnauthorizedException('Acceso denegado: se requiere rol de administrador.');
    }

    // NO PISAR request.user
    // NO PISAR request.usuarioCompleto

    return true;
  }

  private extractTokenFromHeader(request: any): string | null {
    const authHeader = request.headers.authorization;
    if (authHeader?.startsWith('Bearer ')) {
      return authHeader.split(' ')[1];
    }
    return null;
  }
}
