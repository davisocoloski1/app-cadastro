import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class NavbarService {
  apiUrl = environment.adonisUrl
  constructor(private http: HttpClient) {}

  getUser(): Observable<any> {
    return this.http.get(`${this.apiUrl}/users/info`)
  }

  logout() {
    return this.http.delete(`${this.apiUrl}/users/logout`)
  }
}
