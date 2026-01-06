import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Cliente } from '../models/cliente';
import { environment } from '../../../environments/environment';
import { Email } from '../models/email';
import { Observable } from 'rxjs';
import { Telefone } from '../models/telefone';
import { Endereco } from '../models/endereco';

@Injectable({
  providedIn: 'root',
})
export class ClienteService {
  constructor(private http: HttpClient) {}
  apiUrl = environment.adonisUrl

  // Validações
  validarCpf(cpf: string) {
    return this.http.post(`${this.apiUrl}/validations/validarCpf`, { cpf })
  }

  validarCnpj(cnpj: string) {
    return this.http.post(`${this.apiUrl}/validations/validarCnpj`, { cnpj })
  }

  // Controle de clientes
  registrarCliente(cliente: Cliente) {
    return this.http.post(`${this.apiUrl}/clientes/registro/registrarCliente`, cliente)
  }

  // Controle de email e telefone (contato)
  registrarEmail(data: Email): Observable<Email> {
    return this.http.post<Email>(`${this.apiUrl}/clientes/registro/registrarEmail`, data)
  }

  registrarTelefone(data: Telefone): Observable<Telefone> {
    return this.http.post<Telefone>(`${this.apiUrl}/clientes/registro/registrarTelefone`, data)
  }

  // Controle de endereços
  registrarEndereco(data: Endereco): Observable<Endereco> {
    return this.http.post<Endereco>(`${this.apiUrl}/clientes/registro/registrarEndereco`, data)
  }
}
