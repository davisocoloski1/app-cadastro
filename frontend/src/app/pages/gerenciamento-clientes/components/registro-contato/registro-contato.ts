import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ClienteService } from '../../services/cliente.service';
import { Email } from '../../models/email';
import { Telefone } from '../../models/telefone';
import { StepperService } from '../../services/stepper.service';

@Component({
  selector: 'app-registro-contato',
  standalone: false,
  templateUrl: './registro-contato.html',
  styleUrl: './registro-contato.scss',
})
export class RegistroContato implements OnInit {
  emailForm!: FormGroup
  telefoneForm!: FormGroup
  @Output() preenchido = new EventEmitter<boolean>()
  telefoneErrorMsg = ''
  telefoneSuccessMsg = ''
  emailErrorMsg = ''
  emailSuccessMsg = ''

  constructor(
    private fb: FormBuilder,
    private clienteService: ClienteService,
    private stepper: StepperService
  ) {
    this.emailForm = this.fb.group({
      email: ['', [Validators.required]],
      tipo: ['pessoal', [Validators.required]],
      principal: [true, [Validators.required]]
    });
    this.telefoneForm = this.fb.group({
      telefone: ['', [Validators.required]],
      tipo: ['celular', [Validators.required]],
      principal: [true, [Validators.required]]
    })
  }

  ngOnInit(): void {
    this.telefoneForm.patchValue(this.stepper.value.telefone)
    this.emailForm.patchValue(this.stepper.value.email)
    this.telefoneForm.valueChanges.subscribe(value => { this.stepper.update('telefone', value) })
    this.emailForm.valueChanges.subscribe(value => { this.stepper.update('email', value) })
  }

  registrar() {
    if (this.emailForm.invalid || this.telefoneForm.invalid) {
      this.telefoneErrorMsg = 'Todos os campos devem ser preenchidos.'
      return
    }

    this.telefoneForm.patchValue({ telefone: this.telefoneForm.value.telefone.replace(/\D/g, '')})

    const emailData: Email = {
      ...this.emailForm.value
    }

    const telefoneData: Telefone = {
      ...this.telefoneForm.value
    }

    this.clienteService.registrarEmail(emailData).subscribe({
      next: (res: any) => {
        console.log(res)
        this.emailErrorMsg = ''
        this.emailSuccessMsg = 'Contato registrado'
      },
      error: (err: any) => {
        console.log(err)
        this.emailSuccessMsg = ''
        if (err.error.errors) this.emailErrorMsg = err.error.errors[0].message
        else this.emailErrorMsg = 'Ocorreu um erro'  
        this.preenchido.emit(false)
      }
    })

    this.clienteService.registrarTelefone(telefoneData).subscribe({
      next: (res: any) => {
        console.log(res)
        this.telefoneErrorMsg = ''
        this.telefoneSuccessMsg = 'Contato registrado'
      },
      error: (err: any) => {
        console.log(err)
        this.telefoneSuccessMsg = ''
        this.telefoneErrorMsg = 'Ocorreu um erro'
        this.preenchido.emit(false)
      }
    })

    this.preenchido.emit(true)
  }
  
  limpar() {
    this.emailForm.patchValue({
      email: '',
    });
    this.telefoneForm.patchValue({
      telefone: '',
    })
  }
}
