import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { RegistroService } from '../../services/registro.service';

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login implements OnInit {
  loginForm!: FormGroup
  mostrar: boolean = false
  errorMsg = ''
  successMsg = ''

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

  ngOnInit(): void {
    this.errorMsg = history.state.msg ?? null
  }

  mostrarSenha() {
    this.mostrar = !this.mostrar
  }

  login() {
    this.registroService.login({ email: this.loginForm.value.email, password: this.loginForm.value.password }).subscribe({
      next: (res: any) => {
        localStorage.setItem('token', res.token)
        this.errorMsg = ''
        this.successMsg = 'Login realizado.'
        this.router.navigate(['/users/me'])
      }, error: (err: any) => {
        console.log(err)
        if (err.error.message) {
          this.errorMsg = err.error.message
        } else {
          this.errorMsg = err.error
        }
      }
    })
  }
}
