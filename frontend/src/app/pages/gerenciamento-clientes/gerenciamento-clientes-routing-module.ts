import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RegistroClientes } from './components/registro-clientes/registro-clientes';
import { RegistroClientsPage } from './components/registro-clients-page/registro-clients-page';
import { ListagemClientes } from './components/listagem-clientes/listagem-clientes';
import { authGuard } from '../../guards/auth-guard';
import { ViewEditCliente } from './components/view-edit-cliente/view-edit-cliente';

const routes: Routes = [
  {
    path: 'registro',
    component: RegistroClientsPage,
    canActivate: [authGuard]
  },
  {
    path: 'listagem-clientes',
    component: ListagemClientes,
    canActivate: [authGuard]
  },
  {
    path: 'visualizar-cliente/:id',
    component: ViewEditCliente,
    canActivate: [authGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GerenciamentoClientesRoutingModule { }
