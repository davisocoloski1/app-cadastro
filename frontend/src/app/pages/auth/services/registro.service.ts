import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { RegistroModel } from '../models/registro.model';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class RegistroService {
  private apiUrl = environment.adonisUrl

  constructor(private http: HttpClient) { }

  registro(data: RegistroModel, resend: number): Observable<RegistroModel> {
    return this.http.post<RegistroModel>(`${this.apiUrl}/users/registro`, { ...data, resend })
  }

  registroAdmin(data: RegistroModel): Observable<RegistroModel> {
    return this.http.post<RegistroModel>(`${this.apiUrl}/admin/registrarUsuario`, data)
  }

  confirmacao(data: { code: string, email: string }): Observable<string> {
    return this.http.post<string>(`${this.apiUrl}/users/confirmar_conta`, data, { responseType: 'text' as 'json' })
  }

  novoCodigo(data: { email: string, name: string }, resend: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/users/novo_codigo`, { email: data.email, name: data.name, resend: resend })
  }

  login(data: { email: string, password: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/users/login`, { email: data.email, password: data.password })
  }
}