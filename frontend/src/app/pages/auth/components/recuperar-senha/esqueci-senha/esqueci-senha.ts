import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { RecuperarSenhaService } from '../services/recuperar-senha.service';

@Component({
  selector: 'app-esqueci-senha',
  standalone: false,
  templateUrl: './esqueci-senha.html',
  styleUrl: './esqueci-senha.scss',
})
export class EsqueciSenha {
  esqueciSenhaForm!: FormGroup
  errorMsg = history.state.message ?? ''
  successMsg = ''

  constructor(
    private fb: FormBuilder,
    private recuperarSenhaService: RecuperarSenhaService,
    private router: Router
  ) {
    this.esqueciSenhaForm = this.fb.group({
      email: ['', [Validators.required]]
    })
  }

  enviarEmailRecuperacao() {
    this.recuperarSenhaService.linkRecuperacao(this.esqueciSenhaForm.value.email).subscribe({
      next: (res: any) => {
        this.errorMsg = ''
        this.successMsg = res.message
      }, error: (err: any) => {
        this.successMsg = ''
        if (err.error.message) {
          this.errorMsg = err.error.message
        } else {
          this.errorMsg = err.error
          console.log(err)
        }
      }
    })
  }
}