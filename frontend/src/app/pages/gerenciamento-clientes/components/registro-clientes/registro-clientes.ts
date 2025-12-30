import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ClienteService } from '../../services/cliente.service';
import { Cliente } from '../../models/cliente';

@Component({
  selector: 'app-registro-clientes',
  standalone: false,
  templateUrl: './registro-clientes.html',
  styleUrl: './registro-clientes.scss',
})
export class RegistroClientes {
  clientForm!: FormGroup
  errorMsg = ''
  successMsg = ''
  @Output() liberarForm = new EventEmitter<boolean>();
  
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private clienteService: ClienteService
  ) {
    this.clientForm = this.fb.group({
      nome: ['', [Validators.required]],
      cpf_cnpj: ['', [Validators.required]],
      origem: ['', [Validators.required]],
      segmento: ['', [Validators.required]]
    })
  }

  registrar() {
    const data: Cliente = {
      ...this.clientForm.value,
      cpf_cnpj: this.clientForm.value.cpf_cnpj.replace(/\D/g, '')
    }

    this.clienteService.registrarCliente(data).subscribe({
      next: (res: any) => {
        this.successMsg = 'Cliente registrado. Finalize as informações no formulário abaixo.'
        this.liberarForm.emit(true)
      }, error: (err: any) => {
        if (err.error.errors) {
          this.errorMsg = err.error.errors[0].message
        } else {
          console.error(err)
        }
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
