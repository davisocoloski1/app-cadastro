export interface RegistroModel {
  id?: number;
  name: string;
  email: string;
  telefone: string;
  password: string;
  permission: string | 'user'
}
