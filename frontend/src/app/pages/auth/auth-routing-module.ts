import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Registro } from './components/registro/registro';
import { ConfirmarConta } from './components/confirmar-conta/confirmar-conta';
import { Login } from './components/login/login';

const routes: Routes = [
  {
    path: 'registro',
    component: Registro,
  },
  {
    path: 'confirmar-conta/:email/:name',
    component: ConfirmarConta,
  },
  {
    path: 'login',
    component: Login,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RegistroRoutingModule { }
