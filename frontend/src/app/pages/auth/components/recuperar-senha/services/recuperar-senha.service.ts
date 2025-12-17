import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class RecuperarSenhaService {
  apiUrl = environment.adonisUrl
  constructor(private http: HttpClient) {}

  linkRecuperacao(email: string, msg: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/recuperar-senha/enviarEmailRecuperacao`, { email, msg })
  }

  validarToken(token: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/recuperar-senha/validarToken`, { token })
  }

  recuperarSenha(token: string, password: string, password_confirmation: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/recuperar-senha/recuperar-senha`, { token, password, password_confirmation })
  }
}
