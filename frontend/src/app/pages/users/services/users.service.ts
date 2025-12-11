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
}
