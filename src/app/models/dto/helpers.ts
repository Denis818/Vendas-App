import { Venda } from "../Venda";

export interface VendaHelperDto {
  vendaId: number;
  buscarName: string;
  dateRange: Date[];
  totalDestaVenda: number;
}

export interface PaginationDto {
  paginaAtual: number;
  itemsPorPagina: number;
  totalItens: number;
}

export interface VendasDto {
  list: Venda[];
  filtradas: Venda[];
}

export interface CheckFiltersDto {
  isFiltering: boolean;
  isFilteringByDate: boolean;
}
