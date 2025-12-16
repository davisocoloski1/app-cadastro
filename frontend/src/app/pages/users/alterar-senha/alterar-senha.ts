import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UsersService } from '../services/users.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-alterar-senha',
  standalone: false,
  templateUrl: './alterar-senha.html',
  styleUrl: './alterar-senha.scss',
})
export class AlterarSenha {
  stateMsg = history.state.msg
  errorMsg = ''
  successMsg = ''
  passwordConfirmation!: FormGroup

  constructor(
    private fb: FormBuilder,
    private usersService: UsersService,
    private router: Router
  ) {
    this.passwordConfirmation = this.fb.group({
      password: ['', [Validators.required]],
      password_confirmation: ['', [Validators.required]]
    })
  }

  alterarSenha() {
    let password = this.passwordConfirmation.value.password
    let password_confirmation = this.passwordConfirmation.value.password_confirmation

    this.usersService.updatePassword(password, password_confirmation).subscribe({
      next: () => {
        this.successMsg = 'Senha atualizada. Redirecionando...'
        setTimeout(() => { this.router.navigate(['/users/me']) }, 2000)
      }, error: (err: any) => {
        this.errorMsg = err.error.errors[0].message
      }
    })
  }
}
