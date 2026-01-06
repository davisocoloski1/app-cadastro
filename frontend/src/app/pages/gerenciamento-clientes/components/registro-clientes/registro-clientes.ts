import { Component, EventEmitter, OnInit, Output } from '@angular/core';
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
export class RegistroClientes implements OnInit {
  clientForm!: FormGroup
  errorMsg = ''
  successMsg = ''
  @Output() liberarEmail = new EventEmitter<boolean>();
  @Output() preenchido = new EventEmitter<boolean>();
  
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
  
  ngOnInit(): void {
    this.clientForm.patchValue(this.stepper.value.cliente)
    this.clientForm.valueChanges.subscribe(value => { this.stepper.update('cliente', value) })
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
          this.successMsg = 'Cliente registrado. Finalize as informações no formulário abaixo.'
          this.liberarEmail.emit(true)
          this.preenchido.emit(true)
          this.clientForm.disable()
        }, error: (err: any) => {
          this.preenchido.emit(false)
          if (err.error.errors) {
            this.errorMsg = err.error.errors[0].message
          } else {
            console.error(err)
          }
        }
      })
    })
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
