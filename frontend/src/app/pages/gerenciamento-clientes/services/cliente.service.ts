import { HttpClient, HttpParams } from '@angular/common/http';
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

  indexClientes() {
    return this.http.get<Cliente[]>(`${this.apiUrl}/clientes/listagem/listagemClientes`)
  }

  pesquisarClientes(termo?: string) {
    let params = new HttpParams()
    if (termo) {
      params = params.set('query', termo)
    }

    return this.http.get(`${this.apiUrl}/clientes/listagem/pesquisarClientes`, { params })
  }

  getClienteById(id: number) {
    return this.http.get(`${this.apiUrl}/clientes/listagem/listarInfoCliente/${id}`)
  }

  desativarCliente(id: number) {
    return this.http.put(`${this.apiUrl}/clientes/desativar/desativarCliente/${id}`, {})
  }

  desativarParcial(id: number, type: string, targetId: number, status: string) {
    return this.http.put(`${this.apiUrl}/clientes/desativar/desativarPorTipo/${id}/${type}/${targetId}/${status}`, {})
  }

  // Controle de email e telefone (contato)
  registrarEmail(data: Email, id: number): Observable<Email> {
    return this.http.post<Email>(`${this.apiUrl}/clientes/registro/registrarEmail/${id}`, data)
  }

  editarEmail(id: number, data: Email): Observable<Email> {
    return this.http.put<Email>(`${this.apiUrl}/clientes/editar/editar-email/${id}`, data)
  }

  registrarTelefone(data: Telefone, id: number): Observable<Telefone> {
    return this.http.post<Telefone>(`${this.apiUrl}/clientes/registro/registrarTelefone/${id}`, data)
  }

  editarTelefone(id: number, data: Telefone): Observable<Telefone> {
    return this.http.put<Telefone>(`${this.apiUrl}/clientes/editar/editar-telefone/${id}`, data)
  }

  // Controle de endereços
  registrarEndereco(data: Endereco, id: number): Observable<Endereco> {
    return this.http.post<Endereco>(`${this.apiUrl}/clientes/registro/registrarEndereco/${id}`, data)
  }

  editarEndereco(id: number, data: Endereco): Observable<Endereco> {
    return this.http.put<Endereco>(`${this.apiUrl}/clientes/editar/editar-endereco/${id}`, data)
  }
}
