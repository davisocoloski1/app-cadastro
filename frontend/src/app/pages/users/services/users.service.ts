import { Injectable } from '@angular/core';
import { User } from '../models/user';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  apiUrl = environment.adonisUrl
  constructor(private http: HttpClient) {}

  getUsers(): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/users/info`)
  }

  updateUser(data: any) {
    return this.http.put(`${this.apiUrl}/users/update`, data)
  }

  updatePassword(password: string, password_confirmation: string) {
    return this.http.put(`${this.apiUrl}/users/updatePassword`, { password, password_confirmation })
  }

  deleteUser(password: string) {
    return this.http.put(`${this.apiUrl}/users/deleteUser`, { password })
  }

  registroAdmin(data: User): Observable<User> {
    return this.http.post<User>(`${this.apiUrl}/admin/registrarUsuario`, data)
  }

  novoCodigo(data: { email: string, name: string }, resend: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/users/novo_codigo`, { email: data.email, name: data.name, resend: resend })
  }

  index(): Observable<any> {
    return this.http.get(`${this.apiUrl}/users/getUsers`)
  }
}
