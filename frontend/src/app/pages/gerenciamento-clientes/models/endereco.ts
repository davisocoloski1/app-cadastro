export interface Endereco {
  cliente_id?: number
  logradouro: string;
  numero: string;
  complemento: string;
  bairro: string;
  cidade: string;
  estado: string;
  cep: string;
  tipo: string;
  principal: boolean;
}
