import { Component, OnInit } from '@angular/core';
import { UsersService } from '../services/users.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { User } from '../models/user';
import { Router } from '@angular/router';

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
  stateMsg = history.state?.msg
  showDeleteCard = false
  
  constructor(
    private usersService: UsersService,
    private fb: FormBuilder,
    private router: Router
  ) {
    this.editForm = this.fb.group({
      name: [{ value: '', disabled: true}, [Validators.required]],
      email: [{ value: '', disabled: true}, [Validators.required]],
      telefone: [{ value: '', disabled: true}, [Validators.required]],
      password: [{ value: '', disabled: true}]
    })
  }

  ngOnInit(): void {
    this.lockAllFields();
    this.getUser();

    if (this.stateMsg) {
      setTimeout(() => { this.stateMsg = '' }, 10000);
    }
  }
  
  getUser() {
    this.usersService.getUsers().subscribe({
      next: (res: any) => {
        this.user = res

        this.name = this.user.name
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
      next: () => {
        this.errorMsg = ''
        this.lockAllFields()
        window.location.reload()
      },
      error: (err) => {
        this.errorMsg = err.error.message ?? 'Erro ao salvar alterações.'
        this.lockAllFields()
        setTimeout(() => { this.errorMsg = '' }, 5000)
      },
    })
  }

  alterarSenhaRouter() {
    this.router.navigate(['/alterar-senha'], {
      state: { msg: `Olá, ${this.name = this.user.name.split(/\s+/)[0]}.\nDigite e confirme sua senha para alterá-la.` }
    })
  }

  logout() {
    localStorage.removeItem('token')
    setTimeout(() => { this.router.navigate(['/login']) }, 1500)
  }

  private lockAllFields() {
    this.editForm.get('name')?.disable();
    this.editForm.get('email')?.disable();
    this.editForm.get('telefone')?.disable();

    this.nameDisabled = true;
    this.emailDisabled = true;
    this.telefoneDisabled = true;
  }

  private enableOnly(field: 'name' | 'email' | 'telefone') {
    this.lockAllFields();

    this.editForm.get(field)?.enable();

    if (field === 'name') this.nameDisabled = false;
    if (field === 'email') this.emailDisabled = false;
    if (field === 'telefone') this.telefoneDisabled = false;
  }

  toggleName() {
    if (!this.nameDisabled) this.lockAllFields();
    else this.enableOnly('name');
  }

  toggleEmail() {
    if (!this.emailDisabled) this.lockAllFields();
    else this.enableOnly('email');
  }

  toggleTelefone() {
    if (!this.telefoneDisabled) this.lockAllFields();
    else this.enableOnly('telefone');
  }

  toggleDeleteCard() {
    this.showDeleteCard = true
  }

}
