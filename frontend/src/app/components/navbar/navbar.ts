import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { AppRoutingModule } from '../../app-routing-module';
import { Router } from '@angular/router';
import { NavbarService } from './services/navbar.service';
import { User } from '../../pages/users/models/user';
import { AuthService } from '../../pages/auth/services/auth.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-navbar',
  standalone: true,
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss',
  imports: [AppRoutingModule, CommonModule],
})
export class Navbar implements OnInit {
  button1 = '';
  button2 = '';
  router1 = '';
  router2 = '';
  isAdmin = false;
  loggedIn$: Observable<boolean>;
  user!: User;
  token = localStorage.getItem('token');

  constructor(
    private router: Router,
    private navbarService: NavbarService,
    private authService: AuthService
  ) {
    this.loggedIn$ = this.authService.loggedIn$;
  }

  ngOnInit(): void {
    this.getUser();
  }

  getUser() {
    this.navbarService.getUser().subscribe({
      next: (res: any) => {
        this.user = res;

        if (this.user.permission === 'admin') {
          this.isAdmin = true;
        } else {
          this.isAdmin = false;
        }

        this.button1 = 'Minha conta';
        this.router1 = '/users/me';
        this.button2 = 'Sair';
        this.router2 = '';
      },
      error: (err: any) => {
        if (err.status === 401) {
          this.isAdmin = false;
        }

        this.button1 = 'Login';
        this.router1 = '/auth/login';
        this.button2 = 'Cadastro';
        this.router2 = '/auth/registro';
      },
    });
  }

  logout() {
    this.authService.logout();
  }
}
