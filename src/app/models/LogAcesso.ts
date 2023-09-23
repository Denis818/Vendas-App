export interface LogAcesso {
  id: number,
  userName: string,
  dataAcesso: Date,
  acao: string,
  vendaId: number,
  nomeProduto: string,
  precoProduto: number,
  quantidadeVendido: number
}
