import { Venda } from "../Venda";

export interface VendaHelper {
  vendaId: number;
  buscarName: string;
  dateRange: Date[];
  selectedItems: number[];
  totalDestaVenda: number
}

export interface Pagination {
  paginaAtual: number,
  itemsPorPagina: number,
  totalItens: number
}

export interface Vendas {
  list: Venda[];
  filtradas: Venda[];
}

export interface CheckFilters {
  isFiltering: boolean;
  isFilteringByDate: boolean;
}
