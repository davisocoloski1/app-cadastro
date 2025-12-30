import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Cliente } from '../models/cliente';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ClienteService {
  constructor(private http: HttpClient) {}
  apiUrl = environment.adonisUrl

  registrarCliente(cliente: Cliente) {
    return this.http.post(`${this.apiUrl}/clientes/registro/registrarCliente`, cliente)
  }
}
