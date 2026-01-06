import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GerenciamentoClientesRoutingModule } from './gerenciamento-clientes-routing-module';
import { RegistroClientes } from './components/registro-clientes/registro-clientes';
import { ReactiveFormsModule } from '@angular/forms';
import { NgxMaskDirective, NgxMaskPipe, provideNgxMask } from 'ngx-mask';
import { RegistroClientsPage } from './components/registro-clients-page/registro-clients-page';
import { RegistroContato } from './components/registro-contato/registro-contato';
import { RegistroEndereco } from './components/registro-endereco/registro-endereco';


@NgModule({
  declarations: [
    RegistroClientes,
    RegistroClientsPage,
    RegistroContato,
    RegistroEndereco,
  ],
  imports: [
    CommonModule,
    GerenciamentoClientesRoutingModule,
    ReactiveFormsModule,
    NgxMaskDirective,
    NgxMaskPipe
  ],
  providers: [
    provideNgxMask()
  ]
})
export class GerenciamentoClientesModule { }
