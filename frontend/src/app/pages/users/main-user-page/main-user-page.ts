import { Component, OnInit } from '@angular/core';
import { UsersService } from '../services/users.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { User } from '../models/user';

@Component({
  selector: 'app-main-user-page',
  standalone: false,
  templateUrl: './main-user-page.html',
  styleUrl: './main-user-page.scss',
})
export class MainUserPage implements OnInit {
  editForm!: FormGroup
  user!: User
  name = ''
  email = ''
  telefone = ''
  nameDisabled = true
  emailDisabled = true
  telefoneDisabled = true
  errorMsg = ''
  
  constructor(
    private usersService: UsersService,
    private fb: FormBuilder
  ) {
    this.editForm = this.fb.group({
      name: [{ value: '', disabled: true}, [Validators.required]],
      email: [{ value: '', disabled: true}, [Validators.required]],
      telefone: [{ value: '', disabled: true}, [Validators.required]],
      password: [{ value: '', disabled: true}]
    })
  }

  ngOnInit(): void {
    this.getUser()
  }
  
  getUser() {
    this.usersService.getUsers().subscribe({
      next: (res: any) => {
        this.user = res

        this.name = this.user.name.split(/\s+/)[0]
        this.email = this.user.email,
        this.telefone = this.user.telefone

        this.editForm.patchValue({
          name: this.user.name,
          email: this.user.email,
          telefone: this.user.telefone
        })
      }, error: (err: any) => {
        console.log(err)
        if (err.status === 401) {
          if (localStorage.getItem('token')) { localStorage.removeItem('token') }
        }
      }
    })
  }

  salvarAlteracoes() {
    this.errorMsg = ''
    if (this.editForm.invalid) {
      this.editForm.markAllAsTouched()
      return
    }

    const payload = this.editForm.getRawValue()

    if (
      this.user.name === this.editForm.value.name &&
      this.user.email === this.editForm.value.email &&
      this.user.telefone === this.editForm.value.telefone
    ) {
      this.errorMsg = 'Nenhum campo alterado.'
      return
    }

    this.usersService.updateUser(payload).subscribe({
      next: (res: any) => {
        console.log('Atualizado:', res)
      },
      error: (err) => {
        this.errorMsg = err.error.message
        console.log(err)
      },
    })
  }

  toggleName() {
    this.nameDisabled = !this.nameDisabled;

    const control = this.editForm.get('name');
    this.nameDisabled ? control?.disable() : control?.enable();
  }

  toggleEmail() {
    this.emailDisabled = !this.emailDisabled;

    const control = this.editForm.get('email');
    this.emailDisabled ? control?.disable() : control?.enable();
  }

  toggleTelefone() {
    this.telefoneDisabled = !this.telefoneDisabled;

    const control = this.editForm.get('telefone');
    this.telefoneDisabled ? control?.disable() : control?.enable();
  }
}
