import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ClienteService } from '../../services/cliente.service';
import { Email } from '../../models/email';
import { Telefone } from '../../models/telefone';
import { StepperService } from '../../services/stepper.service';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

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
  @Output() statusContato = new EventEmitter<{email: boolean, tel: boolean}>();
  @Output() modoChange = new EventEmitter<'edit' | 'create'>()
  @Input() userId!: number
  @Input() editType: string | null = null
  private _contatoToEdit: any
  fieldsBlocked = true
  emailOk = false
  telOk = false
  telefoneErrorMsg = ''
  telefoneSuccessMsg = ''
  emailErrorMsg = ''
  emailSuccessMsg = ''

  constructor(
    private fb: FormBuilder,
    private clienteService: ClienteService,
    private stepper: StepperService,
    private route: ActivatedRoute,
    private location: Location
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

    this.tempEmailForm = JSON.stringify(this.emailForm.value)
    this.tempoTelefoneForm = JSON.stringify(this.telefoneForm.value)

    this.telefoneForm.valueChanges.subscribe(value => { this.stepper.update('telefone', value) })
    this.emailForm.valueChanges.subscribe(value => { this.stepper.update('email', value) })
  }

  registrar() {
    this.emailErrorMsg = '';
    this.telefoneErrorMsg = '';
    
    let emailFinalizado = false;
    let telFinalizado = false;

    const verificarEEmitirStatus = () => {
      const precisaEmail = (this.editType === 'email' || this.editType === 'all');
      const precisaTel = (this.editType === 'telefone' || this.editType === 'all');

      const emailOk = precisaEmail ? (this.emailSuccessMsg !== '') : true;
      const telOk = precisaTel ? (this.telefoneSuccessMsg !== '') : true;

      if (emailFinalizado && telFinalizado) {
        this.statusContato.emit({ email: emailOk, tel: telOk });
      }
    };

    if (this.editType === 'email' || this.editType === 'all') {
      if (this.emailForm.invalid) {
        this.emailErrorMsg = 'O campo de e-mail deve ser preenchido.';
        emailFinalizado = true; 
        verificarEEmitirStatus();
      } else {
        const emailData: Email = { ...this.emailForm.value };
        this.clienteService.registrarEmail(emailData, this.userId).subscribe({
          next: (res) => {
            this.emailSuccessMsg = 'Contato registrado';
            emailFinalizado = true;
            verificarEEmitirStatus();
          },
          error: (err) => {
            this.tratarErro('email', err);
            emailFinalizado = true;
            verificarEEmitirStatus();
          }
        });
      }
    } else {
      emailFinalizado = true; 
    }

    if (this.editType === 'telefone' || this.editType === 'all') {
      if (this.telefoneForm.invalid) {
        this.telefoneErrorMsg = 'O campo de telefone deve ser preenchido.';
        telFinalizado = true;
        verificarEEmitirStatus();
      } else {
        this.telefoneForm.patchValue({ numero: this.telefoneForm.value.numero.replace(/\D/g, '') });
        const telefoneData: Telefone = { ...this.telefoneForm.value };
        this.clienteService.registrarTelefone(telefoneData, this.userId).subscribe({
          next: (res) => {
            this.telefoneSuccessMsg = 'Contato registrado';
            this.telOk = true;
            telFinalizado = true;
            verificarEEmitirStatus();
          },
          error: (err) => {
            this.tratarErro('telefone', err);
            telFinalizado = true;
            verificarEEmitirStatus();
          }
        });
      }
    } else {
      telFinalizado = true;
    }
  }

  editar() {
    this.emailErrorMsg = '';
    this.telefoneErrorMsg = '';

    if (this.editType === 'email') {
      if (this.emailForm.invalid) {
        this.statusContato.emit({ email: false, tel: true });
        return;
      }
      if (this.tempEmailForm === JSON.stringify(this.emailForm.value)) {
        this.emailErrorMsg = 'Nenhuma alteração detectada.';
        return;
      }

      this.clienteService.editarEmail(this._contatoToEdit[0].id, this.emailForm.value).subscribe({
        next: () => {
          this.emailSuccessMsg = 'Contato atualizado';
          this.statusContato.emit({ email: true, tel: true });
          setTimeout(() => this.location.back(), 1500);
        },
        error: (err) => {
          this.tratarErro('email', err);
          this.statusContato.emit({ email: false, tel: true });
        }
      });
    }

    if (this.editType === 'telefone') {
      if (this.telefoneForm.invalid) {
        this.statusContato.emit({ email: true, tel: false });
        return;
      }
      if (this.tempoTelefoneForm === JSON.stringify(this.telefoneForm.value)) {
        this.telefoneErrorMsg = 'Nenhuma alteração detectada.';
        return;
      }

      this.telefoneForm.patchValue({ numero: this.telefoneForm.value.numero.replace(/\D/g, '') });
      this.clienteService.editarTelefone(this._contatoToEdit[0].id, this.telefoneForm.value).subscribe({
        next: () => {
          this.telefoneSuccessMsg = 'Contato atualizado';
          this.statusContato.emit({ email: true, tel: true });
          setTimeout(() => this.location.back(), 1500);
        },
        error: (err) => {
          this.tratarErro('telefone', err);
          this.statusContato.emit({ email: true, tel: false });
        }
      });
    }
  }

  private tratarErro(tipo: 'email' | 'telefone', err: any) {
    const msg = err.error.message || (err.error.errors ? err.error.errors[0].message : 'Erro desconhecido');
    if (tipo === 'email') this.emailErrorMsg = msg;
    else this.telefoneErrorMsg = msg;
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
      } else { 
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
      } else {
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
    } else {
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
