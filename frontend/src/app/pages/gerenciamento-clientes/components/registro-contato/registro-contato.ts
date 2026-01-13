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
export class RegistroContato implements OnInit {
  emailForm!: FormGroup
  telefoneForm!: FormGroup
  tempEmailForm!: any
  tempoTelefoneForm!: any
  @Output() preenchido = new EventEmitter<boolean>()
  @Output() modoChange = new EventEmitter<'edit' | 'create'>()
  @Input() userId!: number
  @Input() editType: string | null = null
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
    });
    this.telefoneForm = this.fb.group({
      numero: ['', [Validators.required]],
      tipo: ['celular', [Validators.required]],
    })
  }

  @Input() isEditing = false
  @Input() set contatoToEdit(value: any) {
    this._contatoToEdit = value
    this.preencherForms(value)

    if (this.isEditing) {
      if (this.editType === 'email') {
        this.emailForm.disable()
      } else if (this.editType === 'telefone') {
        this.telefoneForm.disable()
      } else if (this.editType === 'all') {
        this.emailForm.disable()
        this.telefoneForm.disable()
      }
    }
  }

  ngOnInit(): void {
    this.telefoneForm.patchValue(this.stepper.value.telefone)

    this.emailForm.patchValue(this.stepper.value.email)
    this.telefoneForm.valueChanges.subscribe(value => { this.stepper.update('telefone', value) })
    this.emailForm.valueChanges.subscribe(value => { this.stepper.update('email', value) })

    this.tempEmailForm = this.emailForm.value
    this.tempoTelefoneForm = this.telefoneForm.value
  }

  registrar() {
    this.emailErrorMsg = ''
    this.telefoneErrorMsg = ''

    if (this.editType === 'email' || this.editType === 'all') {
      if (this.emailForm.invalid) {
        this.emailErrorMsg = 'O campo de e-mail deve ser preenchido.'
        this.preenchido.emit(false)
        return
      }

      const emailData: Email = {
        ...this.emailForm.value
      }

      this.clienteService.registrarEmail(emailData, this.userId).subscribe({
        next: (res: any) => {
          console.log(res)
          this.emailErrorMsg = ''
          this.emailSuccessMsg = 'Contato registrado'
          this.preenchido.emit(true)
        },
        error: (err: any) => {
          console.log(err)
          this.emailSuccessMsg = ''
          if (err.error.errors) this.emailErrorMsg = err.error.errors[0].message
          else this.emailErrorMsg = 'Ocorreu um erro'
          this.preenchido.emit(false)
        }
      })
    }

    if (this.editType === 'telefone' || this.editType === 'all') {
      if (this.telefoneForm.invalid) {
        this.telefoneErrorMsg = 'O campo de telefone deve ser preenchido.'
        this.preenchido.emit(false)
        return
      }

      this.telefoneForm.patchValue({ numero: this.telefoneForm.value.numero.replace(/\D/g, '') })

      const telefoneData: Telefone = {
        ...this.telefoneForm.value
      }

      this.clienteService.registrarTelefone(telefoneData, this.userId).subscribe({
        next: (res: any) => {
          console.log(res)
          this.telefoneErrorMsg = ''
          this.telefoneSuccessMsg = 'Contato registrado'
          this.preenchido.emit(true)
        },
        error: (err: any) => {
          console.log(err)
          this.telefoneSuccessMsg = ''
          this.telefoneErrorMsg = 'Ocorreu um erro'
          this.preenchido.emit(false)
        }
      })
    }
  }

  editar() {
    this.emailErrorMsg = ''
    this.telefoneErrorMsg = ''

    if (this.editType === 'email' || this.editType === 'all') {
      if (this.emailForm.invalid) {
        this.emailErrorMsg = 'O campo de e-mail deve ser preenchido.'
        this.preenchido.emit(false)
        return
      }

      const hasChanges = this.tempEmailForm === this.emailForm

      if (!hasChanges) {
        this.emailErrorMsg = 'Nenhuma alteração foi detectada para salvar.';
        return;
      }

      const emailData: Email = {
        ...this.emailForm.value
      }

      this.clienteService.editarEmail(this._contatoToEdit[0].id, emailData).subscribe({
        next: (res: any) => {
          this.emailErrorMsg = ''
          this.emailSuccessMsg = 'Contato atualizado'
          this.preenchido.emit(true)
        },
        error: (err: any) => {
          console.log(err)
          this.emailSuccessMsg = ''
          if (err.error.errors) this.emailErrorMsg = err.error.errors[0].message
          else this.emailErrorMsg = 'Ocorreu um erro'
          this.preenchido.emit(false)
        }
      })
    }

    if (this.editType === 'telefone' || this.editType === 'all') {
      if (this.telefoneForm.invalid) {
        this.telefoneErrorMsg = 'O campo de telefone deve ser preenchido.'
        this.preenchido.emit(false)
        return
      }

      const hasChanges = this.tempoTelefoneForm === this.telefoneForm

      if (!hasChanges) {
        this.telefoneErrorMsg = 'Nenhuma alteração foi detectada para salvar.';
        return;
      }

      this.telefoneForm.patchValue({ numero: this.telefoneForm.value.numero.replace(/\D/g, '') })

      const telefoneData: Telefone = {
        ...this.telefoneForm.value
      }

      this.clienteService.editarTelefone(this._contatoToEdit[0].id, telefoneData).subscribe({
        next: (res: any) => {
          this.telefoneErrorMsg = ''
          this.telefoneSuccessMsg = 'Contato atualizado'
          this.preenchido.emit(true)
        },
        error: (err: any) => {
          console.log(err)
          this.telefoneSuccessMsg = ''
          this.telefoneErrorMsg = 'Ocorreu um erro'
          this.preenchido.emit(false)
        }
      })
    }
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

  toggleBotaoAcao() {
    this.isEditing = !this.isEditing

    if (!this.isEditing) {
      if (this.editType === 'email') {
        this.emailForm.enable()
        this.emailForm.reset({
          tipo: 'pessoal',
          principal: true
        })
      } else if (this.editType === 'telefone') {
        this.telefoneForm.enable()
        this.telefoneForm.reset({
          tipo: 'celular',
          principal: true
        })
      } else { // editType is 'all' or null
        this.emailForm.enable()
        this.telefoneForm.enable()

        this.emailForm.reset({
          tipo: 'pessoal',
          principal: true
        })
        this.telefoneForm.reset({
          tipo: 'celular',
          principal: true
        })
      }
    } else {
      if (this.editType === 'email') {
        this.emailForm.disable()
      } else if (this.editType === 'telefone') {
        this.telefoneForm.disable()
      } else { // editType is 'all' or null
        this.emailForm.disable()
        this.telefoneForm.disable()
      }
      this.preencherForms(this._contatoToEdit)
    }
  }
  
  limpar() {
    if (this.editType === 'email') {
      this.emailForm.patchValue({
        email: '',
      })
    } else if (this.editType === 'telefone') {
      this.telefoneForm.patchValue({
        numero: '',
      })
    } else { // editType is 'all' or null
      this.emailForm.patchValue({
        email: '',
      })
      this.telefoneForm.patchValue({
        numero: '',
      })
    }
  }

  private preencherForms(value: any) {
    if (!value || value.length === 0) {
      return
    }
    const data = value[0]
    if (!data) {
      this.telefoneErrorMsg = 'Informações de contato incompletas.'
      return
    }

    console.log('Dados para preenchimento: ', data)

    if (this.emailForm && data.hasOwnProperty('email')) {
      this.emailForm.patchValue({
        email: data.email ?? '',
        tipo: data.tipo ?? 'pessoal',
      })
    }

    if (this.telefoneForm && data.hasOwnProperty('numero')) {
      this.telefoneForm.patchValue({
        numero: data.numero ?? '',
        tipo: data.tipo ?? 'celular',
      })
    }
  }
}
