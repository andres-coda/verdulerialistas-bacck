import { IsOptional, IsPositive, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class PaginacionDto {
  @IsOptional()
  @Type(() => Number)
  @IsPositive()
  @Min(1)
  pagina?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsPositive()
  @Min(1)
  limite?: number = 10;
}