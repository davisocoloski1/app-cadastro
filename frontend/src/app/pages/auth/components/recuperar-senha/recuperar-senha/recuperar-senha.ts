import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RecuperarSenhaService } from '../services/recuperar-senha.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-recuperar-senha',
  standalone: false,
  templateUrl: './recuperar-senha.html',
  styleUrl: './recuperar-senha.scss',
})
export class RecuperarSenha {
  token: string | null = null
  recuperarForm!: FormGroup
  errorMsg = ''
  successMsg = ''

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private recuperarService: RecuperarSenhaService,
    private fb: FormBuilder
  ) {
    this.recuperarForm = this.fb.group({
      password: ['', [Validators.required]],
      password_confirmation: ['', [Validators.required]]
    })
  }
  
  ngOnInit(): void {
    this.token = this.route.snapshot.queryParamMap.get('token')

    if (this.token) {
      this.validarToken()
    }
  }

  validarToken() {
    this.recuperarService.validarToken(this.token!).subscribe({
      next: () => {},
      error: (err: any) => {
        console.log(err)
        this.router.navigate(['/esqueci-senha'], {
          state: { message: 'Acesso não autorizado. Acesse o link enviado por e-mail ou solicite-o novamente.' }
        })
      }
    })
  }

  recuperarSenha() {
    let password = this.recuperarForm.value.password
    let password_confirmation = this.recuperarForm.value.password_confirmation

    this.validarToken()
    this.recuperarService.recuperarSenha(this.token!, password, password_confirmation).subscribe({
      next: (res: any) => {
        this.errorMsg = ''
        this.successMsg = res.message
        setTimeout(() => {this.router.navigate(['/login'])}, 1500)
      },
      error: (err: any) => {
        this.successMsg = ''
        if (err.error.errors[0].message) {
          this.errorMsg = err.error.errors[0].message
        } else {
          this.errorMsg = err.error
        }
      }
    }) 
  }
}
