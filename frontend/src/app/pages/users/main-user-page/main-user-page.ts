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
  errorMsg = ''
  stateMsg = history.state?.msg
  nameDisabled = true
  emailDisabled = true
  telefoneDisabled = true
  showDeleteCard = false
  isAdmin = false
  showAdminRegister = false;
  isUserConfirmed: boolean = true
  saveLoading = false
  verifyLoading = false
  
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
        
        if (this.user.permission === 'admin') { this.isAdmin = true }
        else { this.isAdmin = false }
        
        this.name = this.user.name.trim().split(' ')[0]
        this.email = this.user.email,
        this.telefone = this.user.telefone
        this.isUserConfirmed = this.user.confirmed!

        this.editForm.patchValue({
          name: this.user.name,
          email: this.user.email,
          telefone: this.user.telefone
        })
      }, error: (err: any) => {
        console.log(err)
        if (err.status === 401) {
          if (localStorage.getItem('token')) { 
            localStorage.removeItem('token')
            this.router.navigate(['auth/login'], {
              state: { msg: 'Faça login para utilizar nossos serviços.' }
            })
          }
        }
      }
    })
  }

  salvarAlteracoes() {
    if (this.editForm.invalid || this.saveLoading) return;

    this.saveLoading = true

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
      this.saveLoading = false
      return
    }

    this.usersService.updateUser(this.user.id!, payload).subscribe({
      next: (updatedUser: any) => {
        this.errorMsg = ''

        if (this.editForm.value.email !== this.user.email) {
          this.stateMsg = 'Um código de confirmação foi enviado ao seu email'
        }

        this.user = updatedUser
        this.editForm.patchValue(updatedUser)
        this.editForm.markAsPristine()

        this.lockAllFields()
        this.saveLoading = false
      },
      error: (err) => {
        this.saveLoading = false
        console.log(err)
        this.errorMsg = err.error.errors[0].message ?? 'Erro ao salvar alterações.'
        this.lockAllFields()
        setTimeout(() => { this.errorMsg = '' }, 5000)
      },
    })
  }

  enviarCodigoConfirmacao() {
    this.verifyLoading = true
    const email = this.user.email
    const name = this.user.name

    this.usersService.novoCodigo({ email, name }, 1).subscribe({
      next: (res: any) => {
        this.verifyLoading = false
        this.router.navigate(['auth/confirmar-conta', email, name], {
          state: { message: 'Código enviado. Verifique seu e-mail.' }
        })
      }, error: (err: any) => {
        this.verifyLoading = false
        this.errorMsg = err.error
        console.log(err)
      }
    })
  }

  alterarSenhaRouter() {
    this.router.navigate(['users/alterar-senha'], {
      state: { msg: `Olá, ${this.name = this.user.name.split(/\s+/)[0]}.\nDigite e confirme sua senha para alterá-la.` }
    })
  }

  logout() {
    localStorage.removeItem('token')
    this.router.navigate(['auth/login'])
    setTimeout(() => { window.location.reload() }, 500)
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
