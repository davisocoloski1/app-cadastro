import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private loggedIn = new BehaviorSubject<boolean>(this.isTokenValid());

  loggedIn$ = this.loggedIn.asObservable();

  constructor(private router: Router) {
    this.loggedIn.next(this.isTokenValid());
  }

  private isTokenValid(): boolean {
    const token = localStorage.getItem('token');
    const expiresAt = localStorage.getItem('expiresAt');

    if (!token || !expiresAt) {
      return false;
    }

    const exp = new Date(expiresAt).getTime();
    const now = Date.now();

    if (now >= exp) {
      localStorage.removeItem('token');
      localStorage.removeItem('expiresAt');
      return false;
    }

    return true;
  }

  isLoggedIn(): boolean {
    return this.loggedIn.getValue();
  }

  login() {
    this.loggedIn.next(true);
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('expiresAt');
    this.loggedIn.next(false);
    this.router.navigate(['/auth/login'], {
      state: { msg: 'Você foi desconectado.' }
    });
  }

  checkTokenValidity() {
    const isValid = this.isTokenValid();
    if (this.loggedIn.getValue() !== isValid) {
      this.loggedIn.next(isValid);
    }
  }
}
