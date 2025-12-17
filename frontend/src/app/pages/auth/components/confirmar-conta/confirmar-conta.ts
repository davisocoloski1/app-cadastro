import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RegistroService } from '../../services/registro.service';
import { ActivatedRoute, Router } from '@angular/router';


@Component({
  selector: 'app-confirmar-conta',
  standalone: false,
  templateUrl: './confirmar-conta.html',
  styleUrl: './confirmar-conta.scss',
})
export class ConfirmarConta implements OnInit {
  confirmationForm!: FormGroup
  email: string | null = ''
  name: string | null = ''
  canClick: boolean = false
  msg: string = ''
  errorMsg: string = ''
  secondsLeft: number = 60
  btnText: string | number = ''

  constructor(
    private fb: FormBuilder,
    private registroService: RegistroService,
    private route: ActivatedRoute,
    private router: Router,
  ) {
    this.confirmationForm = this.fb.group({
      code: ['', [Validators.required]]
    })

    this.email = this.route.snapshot.paramMap.get('email')
    this.name = route.snapshot.paramMap.get('name')
  }

  ngOnInit(): void {
    const interval = setInterval(() => {
      this.btnText = this.secondsLeft
      this.secondsLeft--

      if (this.secondsLeft === 0) {
        this.canClick = true
        this.btnText = 'Reenviar código'
        clearInterval(interval)
      }
    }, 1000)
  }

  enviarCodigo() {
    if(!this.email) {
      console.error("Email não encontrado na rota!")
      return
    }

    const data = {
      code: this.confirmationForm.value.code,
      email: this.email
    }

    this.registroService.confirmacao(data).subscribe({
      next: (res: any) => {
        this.router.navigate(['/login'])
      },
      error: (err: any) => {
        console.error(err.error)
        this.errorMsg = err.error
      }
    })
  }

  reenviarCodigo() {
    if (!this.email || !this.name) {
      console.error("Email não encontrado na rota!")
      return
    }

    const data = {
      email: this.email,
      name: this.name
    }

    const resend = 1
    this.registroService.novoCodigo({ email: data.email, name: data.name }, resend).subscribe({
      next: () => {
        this.canClick = false
        this.msg = 'Código enviado.'
        this.secondsLeft = 60

        const interval = setInterval(() => {
          this.btnText = this.secondsLeft
          this.secondsLeft--

          if (this.secondsLeft === 0) {
            this.canClick = true
            this.btnText = 'Reenviar código'
            clearInterval(interval)
          }
        }, 1000)
      }, error: (err: any) => {
        console.error(err.error)
        this.errorMsg = err.error
      } 
    })
  }
}
