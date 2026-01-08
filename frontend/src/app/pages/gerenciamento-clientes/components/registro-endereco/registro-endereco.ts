import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, output } from '@angular/core';
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
export class RegistroEndereco implements OnInit, OnDestroy {
  enderecoForm!: FormGroup
  @Output() preenchido = new EventEmitter<boolean>()
  @Input() userId!: number
  private _enderecoToEdit: any
  fieldsBlocked = true
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
      tipo: ['residencial', [Validators.required]],
      principal: [true, [Validators.required]]
    })
  }

  @Input() isEditing = false
  @Input() set enderecoToEdit(value: any) {
    this._enderecoToEdit = value
    console.log(value)

    if (this.enderecoForm && value && Object.keys(value).length > 0) {
      this.enderecoForm.patchValue({
        logradouro: value.enderecos[0].logradouro,
        numero: value.enderecos[0].numero,
        complemento: value.enderecos[0].complemento,
        bairro: value.enderecos[0].bairro,
        cidade: value.enderecos[0].cidade,
        estado: value.enderecos[0].estado,
        cep: value.enderecos[0].cep,
        tipo: value.enderecos[0].tipo,
        principal: value.enderecos[0].principal
      })
    }
  }

  ngOnDestroy(): void {
    // this.enderecoForm.reset()
  }

  ngOnInit(): void {
    if (this.isEditing) {
      this.enderecoForm.disable()
    }

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

    this.clienteService.registrarEndereco(enderecoData, this.userId).subscribe({
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

  editar() {

  }

  toggleBloquearCampos() {
    if (this.fieldsBlocked) {
      this.enderecoForm.enable()
    } else {
      this.enderecoForm.disable()
    }

    this.fieldsBlocked = !this.fieldsBlocked
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
      principal: 'yes'
    })
  }
}
