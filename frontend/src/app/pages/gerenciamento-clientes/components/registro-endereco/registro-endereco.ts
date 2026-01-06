import { Component, EventEmitter, OnInit, Output, output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ClienteService } from '../../services/cliente.service';
import { Endereco } from '../../models/endereco';
import { StepperService } from '../../services/stepper.service';

@Component({
  selector: 'app-registro-endereco',
  standalone: false,
  templateUrl: './registro-endereco.html',
  styleUrl: './registro-endereco.scss',
})
export class RegistroEndereco implements OnInit {
  enderecoForm!: FormGroup
  @Output() preenchido = new EventEmitter<boolean>()
  errorMsg = ''
  successMsg = ''

  constructor(
    private clienteService: ClienteService,
    private fb: FormBuilder,
    private stepper: StepperService
  ) {
    this.enderecoForm = this.fb.group({
      logradouro: ['', [Validators.required]],
      numero: ['', [Validators.required]],
      complemento: ['', [Validators.required]],
      bairro: ['', [Validators.required]],
      cidade: ['', [Validators.required]],
      estado: ['', [Validators.required]],
      cep: ['', [Validators.required]],
      tipoEndereco: ['residencial', [Validators.required]],
      principal: ['yes', [Validators.required]]
    })
  }

  ngOnInit(): void {
    this.enderecoForm.patchValue(this.stepper.value.endereco)
    this.enderecoForm.valueChanges.subscribe(value => { this.stepper.update('endereco', value) })
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

    this.clienteService.registrarEndereco(enderecoData).subscribe({
      next: (res: any) => {
        console.log(res)
        this.errorMsg = ''
        this.successMsg = 'Registro concluido'
        this.preenchido.emit(true)
      }, error: (err: any) => {
        console.log(err)
        this.successMsg = ''
        this.errorMsg = 'Ocorreu um erro'
        this.preenchido.emit(false)
      }
    })
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
      pais: '',
      tipoEndereco: 'residencial',
      principal: 'yes'
    })
  }
}
