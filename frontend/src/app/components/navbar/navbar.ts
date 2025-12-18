import { Component, OnInit } from '@angular/core';
import { AppRoutingModule } from "../../app-routing-module";
import { Router } from '@angular/router';
import { NavbarService } from './services/navbar.service';
import { User } from '../../pages/users/models/user';
import { BrowserModule } from "@angular/platform-browser";

@Component({
  selector: 'app-navbar',
  standalone: true,
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss',
  imports: [AppRoutingModule, BrowserModule],
})
export class Navbar implements OnInit {
  button1 = ''
  button2 = ''
  router1 = ''
  router2 = ''
  isAdmin = false
  isLogged = false
  user!: User
  token = localStorage.getItem('token')

  constructor(
    private router: Router,
    private navbarService: NavbarService
  ) {}

  ngOnInit(): void {
    this.getUser()
  }

  getUser() {
    this.navbarService.getUser().subscribe({
      next: (res: any) => {
        this.user = res
        this.isLogged = true
        
        if (this.user.permission === 'admin') {
          this.isAdmin = true
        } else {
          this.isAdmin = false
        }

        this.button1 = 'Minha conta'
        this.router1 = '/users/me'
        this.button2 = 'Sair'
        this.router2 = ''
      },
      error: (err: any) => {
        this.isLogged = false

        if (err.status === 401) {
          this.isAdmin = false
        }

        this.button1 = 'Login'
        this.router1 = '/auth/login'
        this.button2 = 'Cadastro'
        this.router2 = '/auth/registro'

        console.log(err)
      }
    })
  }

  logout() {
    localStorage.removeItem('token')

    setTimeout(() => { this.router.navigate(['']) }, 1500)
  }
}
