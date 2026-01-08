import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
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
export class RegistroContato implements OnInit, OnDestroy {
  emailForm!: FormGroup
  telefoneForm!: FormGroup
  @Output() preenchido = new EventEmitter<boolean>()
  @Input() userId!: number
  private _contatoToEdit: any
  fieldsBlocked = true
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
      numero: ['', [Validators.required]],
      tipo: ['celular', [Validators.required]],
      principal: [true, [Validators.required]]
    })
  }

  @Input() isEditing = false
  @Input() set contatoToEdit(value: any) {
    this._contatoToEdit = value

    if (this.emailForm && value && Object.keys(value).length > 0) {
      this.emailForm.patchValue({
        email: value.emails[0]?.email ?? '',
        tipo: value.emails[0].tipo,
        principal: value.emails[0].principal
      })
    }

    if (this.telefoneForm && value && Object.keys(value).length > 0) {
      this.telefoneForm.patchValue({
        numero: value.telefones[0]?.numero ?? '',
        tipo: value.telefones[0].tipo,
        principal: value.telefones[0].principal
      })
    }
  }

  ngOnDestroy(): void {
    // this.telefoneForm.reset()
    // this.emailForm.reset()
  }

  ngOnInit(): void {
    if (this.isEditing) {
      this.emailForm.disable()
      this.telefoneForm.disable()
    }

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

    this.telefoneForm.patchValue({ numero: this.telefoneForm.value.numero.replace(/\D/g, '')})

    const emailData: Email = {
      ...this.emailForm.value
    }

    const telefoneData: Telefone = {
      ...this.telefoneForm.value
    }

    this.clienteService.registrarEmail(emailData, this.userId).subscribe({
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

    this.clienteService.registrarTelefone(telefoneData, this.userId).subscribe({
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

  editar() {

  }

  toggleBloquearCampos() {
    if (this.fieldsBlocked) {
      this.emailForm.enable()
      this.telefoneForm.enable()
    } else {
      this.emailForm.disable()
      this.telefoneForm.disable()
    }

    this.fieldsBlocked = !this.fieldsBlocked
  }
  
  limpar() {
    this.emailForm.patchValue({
      email: '',
    });
    this.telefoneForm.patchValue({
      numero: '',
    })
  }
}
