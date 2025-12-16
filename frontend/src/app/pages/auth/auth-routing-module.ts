import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Registro } from './components/registro/registro';
import { ConfirmarConta } from './components/confirmar-conta/confirmar-conta';
import { Login } from './components/login/login';
import { authGuard } from '../../guards/auth-guard';
import { EsqueciSenha } from './components/recuperar-senha/esqueci-senha/esqueci-senha';
import { RecuperarSenha } from './components/recuperar-senha/recuperar-senha/recuperar-senha';

const routes: Routes = [
  {
    path: 'registro',
    component: Registro,
    canActivate: [authGuard]
  },
  {
    path: 'confirmar-conta/:email/:name',
    component: ConfirmarConta,
    canActivate: [authGuard]
  },
  {
    path: 'login',
    component: Login,
    canActivate: [authGuard]
  },
  {
    path: 'esqueci-senha',
    component: EsqueciSenha
  },
  {
    path: 'recuperar-senha',
    component: RecuperarSenha
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RegistroRoutingModule { }
