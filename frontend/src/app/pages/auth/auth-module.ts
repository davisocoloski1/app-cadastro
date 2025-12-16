import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RegistroRoutingModule } from './auth-routing-module';
import { ReactiveFormsModule } from '@angular/forms';
import { Registro } from './components/registro/registro';
import { ConfirmarConta } from './components/confirmar-conta/confirmar-conta';
import { Login } from './components/login/login';
import { EsqueciSenha } from './components/recuperar-senha/esqueci-senha/esqueci-senha';
import { RecuperarSenha } from './components/recuperar-senha/recuperar-senha/recuperar-senha';


@NgModule({
  declarations: [
    Registro,
    ConfirmarConta,
    Login,
    EsqueciSenha,
    RecuperarSenha,
    RecuperarSenha,
  ],
  imports: [
    CommonModule,
    RegistroRoutingModule,
    ReactiveFormsModule
  ]
})
export class RegistroModule { }
