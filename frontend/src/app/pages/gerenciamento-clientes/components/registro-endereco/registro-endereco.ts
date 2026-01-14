import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ClienteService } from '../../services/cliente.service';
import { Endereco } from '../../models/endereco';
import { StepperService } from '../../services/stepper.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-registro-endereco',
  standalone: false,
  templateUrl: './registro-endereco.html',
  styleUrl: './registro-endereco.scss',
})
export class RegistroEndereco implements OnInit {
  enderecoForm!: FormGroup
  tempForm!: any
  @Output() preenchido = new EventEmitter<boolean>()
  @Input() userId!: number
  private _enderecoToEdit: any
  fieldsBlocked = true
  errorMsg = ''
  successMsg = ''

  constructor(
    private clienteService: ClienteService,
    private fb: FormBuilder,
    private stepper: StepperService,
    private location: Location
  ) {
    this.enderecoForm = this.fb.group({
      logradouro: ['', [Validators.required]],
      numero: ['', [Validators.required]],
      complemento: ['', [Validators.required]],
      bairro: ['', [Validators.required]],
      cidade: ['', [Validators.required]],
      estado: ['', [Validators.required]],
      cep: ['', [Validators.required]],
      tipo: ['residencial', [Validators.required]],
    })
  }

  @Input() isEditing = false
  @Input() set enderecoToEdit(value: any) {
    this._enderecoToEdit = value
    this.preencherForms(value)

    if (this.isEditing) {
      this.enderecoForm.disable()
    }
  }

  ngOnInit(): void {
    this.enderecoForm.patchValue(this.stepper.value.endereco)
    this.enderecoForm.valueChanges.subscribe(value => { this.stepper.update('endereco', value) })
    
    this.tempForm = JSON.stringify(this.enderecoForm.value)
  } 

  registrar() {
    if (this.enderecoForm.invalid) {
      this.errorMsg = 'Todos os campos devem ser preenchidos.'
      return
    }

    this.enderecoForm.patchValue({ cep: this.enderecoForm.value.cep.replace(/\D/g, '') })

    const enderecoData: Endereco = { 
      ...this.enderecoForm.value
    }

    this.clienteService.registrarEndereco(enderecoData, this.userId).subscribe({
      next: (res: any) => {
        this.errorMsg = ''
        this.successMsg = 'Registro concluido'
        this.preenchido.emit(true)
      }, error: (err: any) => {
        console.log(err)
        this.successMsg = ''
          if (err.error.message) {
            this.successMsg = err.error.message
          } else if (err.error.errors) {
            this.successMsg = err.error.errors[0].message
          }
        this.preenchido.emit(false)
      }
    })
  }

  editar() {
    if (this.enderecoForm.invalid) {
      this.errorMsg = 'Todos os campos devem ser preenchidos.'
      return
    }
    
    const currentEnderecoValue = JSON.stringify(this.enderecoForm.value)
    const hasChanges = this.tempForm !== currentEnderecoValue

    if (!hasChanges) {
      this.errorMsg = 'Nenhuma alteração foi detectada para salvar.';
      return;
    }

    this.enderecoForm.patchValue({ cep: this.enderecoForm.value.cep.replace(/\D/g, '') })

    const enderecoData: Endereco = {
      ...this.enderecoForm.value
    }

    this.clienteService.editarEndereco(this._enderecoToEdit[0].id, enderecoData).subscribe({
      next: (res: any) => {
        this.errorMsg = ''
        this.successMsg = 'Endereço atualizado'
        this.preenchido.emit(true)

        setTimeout(() => {
          this.location.back()
        }, 1500)
      }, error: (err: any) => {
        console.log(err)
        this.successMsg = ''
          if (err.error.message) {
            this.errorMsg = err.error.message
          } else if (err.error.errors) {
            this.errorMsg = err.error.errors[0].message
          }
        this.preenchido.emit(false)
      }
    })
  }

  toggleBloquearCampos() {
    if (this.fieldsBlocked) {
      this.enderecoForm.enable()
    } else {
      this.enderecoForm.disable()
    }

    this.fieldsBlocked = !this.fieldsBlocked
  }

  toggleBotaoAcao() {
    this.isEditing = !this.isEditing
    
    if (!this.isEditing) {
      this.enderecoForm.enable()

      this.enderecoForm.reset({
        tipo: 'residencial',
        principal: true
      })
    } else {
      this.enderecoForm.disable()

      this.preencherForms(this._enderecoToEdit)
    }
  }

  limpar() {
    this.enderecoForm.patchValue({
      logradouro: '',
      numero: '',
      complemento: '',
      bairro: '',
      cidade: '',
      estado: '',
      cep: '',
      tipo: 'residencial',
    })
  }

  private preencherForms(value: any) {
    if (!value || value.length === 0) {
      this.errorMsg = 'Informações de endereço incompletas.'
      return
    }

    const endereco = value[0]

    if (this.enderecoForm && endereco && Object.keys(endereco).length > 0) {
      this.enderecoForm.patchValue({
        logradouro: endereco.logradouro ?? '',
        numero: endereco.numero ?? '',
        complemento: endereco.complemento ?? '',
        bairro: endereco.bairro ?? '',
        cidade: endereco.cidade ?? '',
        estado: endereco.estado ?? '',
        cep: endereco.cep ?? '',
        tipo: endereco.tipo ?? 'residencial',
        principal: endereco.principal ?? true
      })
    }
  }
}
