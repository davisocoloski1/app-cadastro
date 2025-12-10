import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { RegistroService } from '../../services/registro.service';

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {
  loginForm!: FormGroup

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private registroService: RegistroService
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required]],
      password: ['', [Validators.required]]
    })
  }

  login() {
    this.registroService.login({ email: this.loginForm.value.email, password: this.loginForm.value.password }).subscribe({
      next: (res: any) => {
        localStorage.setItem('token', res.token)
      }
    })
  }
}
