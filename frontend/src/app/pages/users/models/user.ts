export interface User {
  id?: number,
  name: string,
  email: string,
  telefone: string,
  password: string,
  permission: string,
  confirmed?: boolean
}
