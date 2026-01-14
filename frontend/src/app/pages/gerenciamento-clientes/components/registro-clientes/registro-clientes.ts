import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ClienteService } from '../../services/cliente.service';
import { Cliente } from '../../models/cliente';
import { StepperService } from '../../services/stepper.service';

@Component({
  selector: 'app-registro-clientes',
  standalone: false,
  templateUrl: './registro-clientes.html',
  styleUrl: './registro-clientes.scss',
})
export class RegistroClientes implements OnInit, OnDestroy {
  clientForm!: FormGroup
  errorMsg = ''
  successMsg = ''
  fieldsBlocked = true
  private _clienteToEdit: any
  @Output() liberarEmail = new EventEmitter<boolean>();
  @Output() preenchido = new EventEmitter<boolean>();
  @Output() clienteBody = new EventEmitter<Cliente>();
  
  constructor(
    private fb: FormBuilder,
    private stepper: StepperService,
    private clienteService: ClienteService
  ) {
    this.clientForm = this.fb.group({
      nome: ['', [Validators.required]],
      cpf_cnpj: ['', [Validators.required]],
      origem: ['', [Validators.required]],
      segmento: ['', [Validators.required]]
    })
  }
  
  @Input() isEditing!: boolean
  @Input() set clienteToEdit(value: any) {
    this._clienteToEdit = value

    if (this.clientForm && value && Object.keys(value).length > 0) {
      this.clientForm.patchValue({
        nome: value[0].nome,
        cpf_cnpj: value[0].cpfCnpj || value.cpf_cnpj,
        origem: value[0].origem,
        segmento: value[0].segmento
      })
    }
  }

  get clienteToEdit() {
    return this._clienteToEdit
  }
  
  ngOnDestroy(): void {
    // this.clientForm.reset()
  }

  ngOnInit(): void {    
    if (this.isEditing) {
      this.clientForm.disable()
    } else {
      this.clientForm.patchValue(this.stepper.value.cliente)
      this.clientForm.valueChanges.subscribe(value => { this.stepper.update('cliente', value) })
    }
  }

  registrar() {
    if (this.clientForm.invalid) {
      this.errorMsg = 'Todos os campos devem ser preenchidos.'
      return
    }

    const data: Cliente = {
      ...this.clientForm.value,
      cpf_cnpj: this.clientForm.value.cpf_cnpj.replace(/\D/g, '')
    }

    const isCnpj = data.cpf_cnpj.length > 11
    const tipo = isCnpj ? 'cnpj' : 'cpf'

    this.validarDocumento(tipo, data.cpf_cnpj, () => {
      this.clienteService.registrarCliente(data).subscribe({
        next: (res: any) => {
          this.errorMsg = ''
          this.successMsg = 'Cliente registrado. Finalize as informações no formulário abaixo.'
          console.log(res)
          this.liberarEmail.emit(true)
          this.preenchido.emit(true)
          this.clienteBody.emit(res)
          this.clientForm.disable()
        }, error: (err: any) => {
          this.preenchido.emit(false)
          this.successMsg = ''
          if (err.error.errors) {
            this.errorMsg = err.error.errors[0].message
          } else if (err.error.message) {
            this.errorMsg = err.error.message
          } else {
            console.log(err)
          }
        }
      })
    })
  }

  editar() {
    if (this.clientForm.invalid) {
      this.errorMsg = 'Todos os campos devem ser preenchidos.'
      return
    }

    const data: Cliente = {
      ...this.clientForm.value,
    }

    const clienteId = this.clienteToEdit[0].id

    this.clienteService.editarCliente(clienteId, data).subscribe({
      next: (res: any) => {
        this.errorMsg = ''
        this.successMsg = res.message
      },
      error: (err: any) => {
        this.successMsg = ''
        if (err.error.errors) {
          this.errorMsg = err.error.errors[0].message
        } else if (err.error.message) {
          this.errorMsg = err.error.message
        } else {
          console.log(err)
        }
      }
    })
  }

  toggleBloquearCampos() {
    if (this.fieldsBlocked) {
      this.clientForm.enable()
    } else {
      this.clientForm.disable()
    }

    this.fieldsBlocked = !this.fieldsBlocked
  }

  private validarDocumento(tipo: string, documento: string, onSuccess: () => void) {
    const req = tipo === 'cpf' ? this.clienteService.validarCpf(documento) : this.clienteService.validarCnpj(documento)

    req.subscribe({
      next: () => onSuccess(),
      error: (err: any) => {
        this.errorMsg = err.error.message || 'Documento inválido.'
        console.log(err)
      }
    })
  }

  limpar() {
    this.clientForm.patchValue({
      nome: '',
      cpf_cnpj: '',
      origem: '',
      segmento: ''
    })
  }
}
