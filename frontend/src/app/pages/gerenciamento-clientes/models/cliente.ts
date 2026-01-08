export interface Cliente {
  id: number
  nome: string;
  cpf_cnpj: string;
  origem: string;
  segmento: string;
  ativo?: boolean
}
