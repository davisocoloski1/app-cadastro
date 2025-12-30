import { Component, OnInit } from '@angular/core';
import { UsersService } from '../services/users.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-confirmar-troca-email',
  standalone: false,
  templateUrl: './confirmar-troca-email.html',
  styleUrl: './confirmar-troca-email.scss',
})
export class ConfirmarTrocaEmail implements OnInit{
  
  constructor(
    private usersService: UsersService,
    private router: Router
  ) {}
  
  ngOnInit(): void {
    const token = new URLSearchParams(window.location.search).get('token')

    this.usersService.confirmarTrocaEmail(token!).subscribe({
      error: (err: any) => {
        console.log(err)
      }
    })
  }
}
