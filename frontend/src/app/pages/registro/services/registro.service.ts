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

  registro(data: RegistroModel): Observable<RegistroModel> {
    return this.http.post<RegistroModel>(`${this.apiUrl}/users/registro`, data)
  }
}
