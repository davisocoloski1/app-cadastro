import { Component, Input, OnInit } from '@angular/core';
import { UsersService } from '../services/users.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { User } from '../models/user';

@Component({
  selector: 'app-admin-edit-user',
  standalone: false,
  templateUrl: './admin-edit-user.html',
  styleUrl: './admin-edit-user.scss',
})
export class AdminEditUser implements OnInit {
  editForm!: FormGroup
  user!: User
  admin!: User

  errorMsg = ''
  successMsg = ''

  adminName = ''
  name = ''
  email = ''
  telefone = ''

  saveLoading = false
  alterarSenhaLoading = false
  nameDisabled = true
  emailDisabled = true
  telefoneDisabled = true
  isUserConfirmed = false

  constructor(
    private usersService: UsersService,
    private router: Router,
    private route: ActivatedRoute,
    private fb: FormBuilder,
  ) {
    this.editForm = this.fb.group({
      name: [{ value: '', disabled: true }, [Validators.required]],
      email: [{ value: '', disabled: true }, [Validators.required]],
      telefone: [{ value: '', disabled: true }, [Validators.required]],
    })
  }

  ngOnInit(): void {
    this.lockAllFields()
    const id = Number(this.route.snapshot.paramMap.get('id'))
    this.getUserById(id)
    this.getUser()
  }

  getUserById(id: number) {
    this.usersService.getUserById(id).subscribe({
      next: (res: any) => {
        this.user = res[0]
        
        this.name = this.user.name
        this.email = this.user.email,
        this.telefone = this.user.telefone
        this.isUserConfirmed = this.user.confirmed!

        this.editForm.patchValue({
          name: this.user.name,
          email: this.user.email,
          telefone: this.user.telefone
        })
      },
      error: (err: any) => console.log(err)
    })
  }

  getUser() {
    this.usersService.getUsers().subscribe({
      next: (res: any) => {
        this.admin = res
        this.adminName = res.name
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
        console.log(err)
      }
    })
  }

  salvarAlteracoes() {
    if (this.editForm.invalid || this.saveLoading) return;

    this.saveLoading = true
    this.errorMsg = ''
    const id = Number(this.route.snapshot.paramMap.get('id'))
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

    this.usersService.updateUser(id, payload).subscribe({
      next: () => {
        this.errorMsg = ''
        this.lockAllFields()
        this.saveLoading = false
        window.location.reload()
      },
      error: (err) => {
        this.errorMsg = err.error.message ?? 'Erro ao salvar alterações.'
        this.lockAllFields()
        this.saveLoading = false
        setTimeout(() => { this.errorMsg = '' }, 5000)
      },
    })
  }

  enviarAlteracaoSenha() {
    if (this.editForm.invalid || this.alterarSenhaLoading) return;
    this.alterarSenhaLoading = true

    this.usersService.enviarRecuperacao(this.user.email).subscribe({
      next: () => {
        this.successMsg = 'Email enviado.'
        this.alterarSenhaLoading = false
      },
      error: (err: any) => {
        this.alterarSenhaLoading = false
        this.errorMsg = 'Erro ao enviar email.'
        console.log(err)
      }
    })
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
}
