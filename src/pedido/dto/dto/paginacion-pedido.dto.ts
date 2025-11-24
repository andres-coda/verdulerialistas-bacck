import { IsOptional, IsString, IsEnum } from 'class-validator';
import { PaginacionDto } from '../paginacionDto.dto';

export enum EstadoPedido {
  PENDIENTE = 'pendiente',
  ENVIADO = 'enviado',
  COMPLETADO = 'completado',
  CANCELADO = 'cancelado'
}

export class PaginacionPedidoDto extends PaginacionDto {
  @IsOptional()
  @IsEnum(EstadoPedido)
  estado?: EstadoPedido;

  @IsOptional()
  @IsString()
  proveedor?: string; // ID del proveedor

  @IsOptional()
  @IsString()
  fechaDesde?: string; // formato: YYYY-MM-DD

  @IsOptional()
  @IsString()
  fechaHasta?: string; // formato: YYYY-MM-DD
}