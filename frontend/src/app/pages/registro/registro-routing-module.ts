import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Registro } from './components/registro/registro';
import { ConfirmarConta } from './components/confirmar-conta/confirmar-conta';
import { Login } from './components/login/login';
import { authGuard } from './guards/auth-guard';

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
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RegistroRoutingModule { }
