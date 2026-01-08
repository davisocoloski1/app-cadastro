import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GerenciamentoClientesRoutingModule } from './gerenciamento-clientes-routing-module';
import { RegistroClientes } from './components/registro-clientes/registro-clientes';
import { ReactiveFormsModule } from '@angular/forms';
import { NgxMaskDirective, NgxMaskPipe, provideNgxMask } from 'ngx-mask';
import { RegistroClientsPage } from './components/registro-clients-page/registro-clients-page';
import { RegistroContato } from './components/registro-contato/registro-contato';
import { RegistroEndereco } from './components/registro-endereco/registro-endereco';
import { FinalizarRegistro } from './components/finalizar-registro/finalizar-registro';
import { ListagemClientes } from './components/listagem-clientes/listagem-clientes';
import { MasksPipe } from '../../pipes/masks-pipe';
import { ViewEditCliente } from './components/view-edit-cliente/view-edit-cliente';

@NgModule({
  declarations: [
    RegistroClientes,
    RegistroClientsPage,
    RegistroContato,
    RegistroEndereco,
    FinalizarRegistro,
    ListagemClientes,
    MasksPipe,
    ViewEditCliente
  ],
  imports: [
    CommonModule,
    GerenciamentoClientesRoutingModule,
    ReactiveFormsModule,
    NgxMaskDirective,
    NgxMaskPipe,
  ],
  providers: [
    provideNgxMask()
  ]
})
export class GerenciamentoClientesModule { }
