import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RegistroClientsPage } from './components/registro-clients-page/registro-clients-page';
import { ListagemClientes } from './components/listagem-clientes/listagem-clientes';
import { authGuard } from '../../guards/auth-guard';
import { ViewEditCliente } from './components/view-edit-cliente/view-edit-cliente';
import { RegistroContato } from './components/registro-contato/registro-contato';
import { RegistroClientes } from './components/registro-clientes/registro-clientes';
import { RegistroEndereco } from './components/registro-endereco/registro-endereco';
import { EditClientePage } from './components/edit-cliente-page/edit-cliente-page';

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
  },
  {
    path: 'editar-cliente/:tipo/:id/:editing',
    component: EditClientePage,
    canActivate: [authGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GerenciamentoClientesRoutingModule { }
