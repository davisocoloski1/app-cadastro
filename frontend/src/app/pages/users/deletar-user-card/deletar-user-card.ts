import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UsersService } from '../services/users.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-deletar-user-card',
  standalone: false,
  templateUrl: './deletar-user-card.html',
  styleUrl: './deletar-user-card.scss',
})
export class DeletarUserCard {
  deleteForm!: FormGroup
  errorMsg = ''
  successMsg = ''
  isLoading = false
  @Output() hideCard = new EventEmitter<boolean>()

  constructor(
    private userService: UsersService,
    private fb: FormBuilder,
    private router: Router
  ) {
    this.deleteForm = this.fb.group({
      password: ['', [Validators.required]]
    })
  }

  deletarUsuario() {
    if (this.deleteForm.invalid || this.isLoading) return;

    this.isLoading = true

    this.userService.deleteUser({ password: this.deleteForm.value.password }).subscribe({
      next: (res: any) => {
        this.errorMsg = ''
        this.successMsg = res.message
        if (localStorage.getItem('token')) localStorage.removeItem('token');
        this.isLoading = false

        setTimeout(() => { this.router.navigate(['auth/login']) }, 2000)
      },
      error: (err: any) => {
        this.successMsg = ''
        this.isLoading = false
        if (err.error.message) {
          this.errorMsg = err.error.message
        } else {
          this.errorMsg = `${err.status}: ocorreu um erro ao deletar a conta`
          console.log(err)
        }
      }
    })
  }

  cancelar() {
    this.hideCard.emit(false)
  }
}
