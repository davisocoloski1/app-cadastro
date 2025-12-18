import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UsersService } from '../../services/users.service';
import { RecuperarSenhaService } from '../../../auth/components/recuperar-senha/services/recuperar-senha.service';
import { Router } from '@angular/router';
import { User } from '../../models/user';

@Component({
  selector: 'app-admin-registro',
  standalone: false,
  templateUrl: './admin-registro.html',
  styleUrl: './admin-registro.scss',
})
export class AdminRegistro {
  adminRegistroForm!: FormGroup
  errorMsg = ''

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
    const raw = this.adminRegistroForm.getRawValue()
    let msg = 'Um administrador do nosso sistema realizou o seu cadastro. Segue o link para alteração de senha.'

    const data: User = {
      name: raw.name,
      email: raw.email,
      telefone: raw.telefone,
      password: String(raw.password),
      permission: raw.permission
    }

    this.usersService.registroAdmin(data).subscribe({
      next: (res: any) => {
        console.log(res)
        this.recuperacaoService.linkRecuperacao(data.email).subscribe({
          next: (res: any) => {
            console.log(res)
          }, error: (err: any) => {
            console.log(err)
          }
        })
      }, error: (err: any) => {
        console.log(err)
        if (err.error.errors[0].message) {
          this.errorMsg = err.error.errors[0].message
        }
        console.log(this.errorMsg)
      }
    })
  }
}
