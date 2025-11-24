export interface PaginacionResponse<T> {
  datos: T[];
  meta: {
    paginaActual: number;
    itemsPorPagina: number;
    totalItems: number;
    totalPaginas: number;
    tienePaginaAnterior: boolean;
    tienePaginaSiguiente: boolean;
  };
}