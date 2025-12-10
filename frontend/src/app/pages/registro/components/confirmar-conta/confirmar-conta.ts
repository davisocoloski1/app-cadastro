import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RegistroService } from '../../services/registro.service';
import { ActivatedRoute, Router } from '@angular/router';


@Component({
  selector: 'app-confirmar-conta',
  standalone: false,
  templateUrl: './confirmar-conta.html',
  styleUrl: './confirmar-conta.scss',
})
export class ConfirmarConta {
  confirmationForm!: FormGroup
  email: string | null = null

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
        console.log(res)
        this.router.navigate(['/login'])
      },
      error: (err: any) => console.log(err)
    })
  }
}
