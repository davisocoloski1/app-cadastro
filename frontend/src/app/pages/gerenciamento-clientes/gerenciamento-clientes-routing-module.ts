import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RegistroClientes } from './components/registro-clientes/registro-clientes';
import { RegistroClientsPage } from './components/registro-clients-page/registro-clients-page';

const routes: Routes = [
  {
    path: 'registro',
    component: RegistroClientsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GerenciamentoClientesRoutingModule { }
