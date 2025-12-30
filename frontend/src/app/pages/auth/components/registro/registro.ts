import { Component } from '@angular/core';
import { RegistroService } from '../../services/registro.service';
import { RegistroModel } from '../../models/registro.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-registro',
  standalone: false,
  templateUrl: './registro.html',
  styleUrl: './registro.scss',
})
export class Registro {
  form!: FormGroup
  errorMsg: string = ''

  constructor(
    private registroService: RegistroService,

    private fb: FormBuilder,
    private router: Router
  ) {
    this.form = this.fb.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.required]],
      telefone: ['', [Validators.required]],
      password: ['', [Validators.required]],
    })
  }

  registro() {
    const data: RegistroModel = {
      name: this.form.value.name,
      email: this.form.value.email,
      telefone: this.form.value.telefone,
      password: this.form.value.password,
      permission: 'user'
    }

    this.registroService.registro(data).subscribe({
      next: () => {
        this.router.navigate(["/auth/login"], {
          state: { msg: 'Cadastro realizado! Faça login para utilizar nossos serviços.' }
        })
      },
      error: (err: any) => {
        console.log(err)
        if (err.error.errors) {
          this.errorMsg = err.error.errors[0].message
        } else if (err.error) {
          this.errorMsg = err.error.message
        } else {
          console.log(err)
        }
      }
    })
  }
}
