import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UsersService } from '../../services/users.service';
import { RecuperarSenhaService } from '../../../auth/components/recuperar-senha/services/recuperar-senha.service';
import { Router } from '@angular/router';
import { User } from '../../models/user';
import { switchMap, finalize } from 'rxjs';

@Component({
  selector: 'app-admin-registro',
  standalone: false,
  templateUrl: './admin-registro.html',
  styleUrl: './admin-registro.scss',
})
export class AdminRegistro {
  adminRegistroForm!: FormGroup
  errorMsg = ''
  successMsg = ''
  isLoading = false

  constructor(
    private fb: FormBuilder,
    private usersService: UsersService,
    private recuperacaoService: RecuperarSenhaService,
    private router: Router
  ) {
    this.adminRegistroForm = this.fb.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.required]],
      telefone: ['', [Validators.required]],
      password: [{ value: "12345678", disabled: true}, [Validators.required]],
      permission: [['none'], [Validators.required]]
    })
  }

  registrarUsuario() {
    if (this.adminRegistroForm.invalid || this.isLoading) return;

    this.isLoading = true;
    this.errorMsg = '';
    this.successMsg = '';

    const raw = this.adminRegistroForm.getRawValue()

    const data: User = {
      name: raw.name,
      email: raw.email,
      telefone: raw.telefone,
      password: String(raw.password),
      permission: raw.permission
    }

    this.usersService.registroAdmin(data).pipe(
      switchMap(() => this.recuperacaoService.linkRecuperacao(data.email)),
      finalize(() => (this.isLoading = false))
      ).subscribe({
      next: (res) => {
        this.errorMsg = ''
        this.successMsg = 'Usuário criado. E-mail de verificação enviado.'
        console.log(res);
      },
      error: (err: any) => {
        this.successMsg = ''
        if (err?.error?.errors?.[0]?.message) {
          this.errorMsg = err.error.errors[0].message;
          return;
        }

        if (err?.error?.message) {
          this.errorMsg = err.error.message;
          return;
        }

        this.errorMsg = err?.message ?? 'Erro inesperado';
      }
    });
  }
}
