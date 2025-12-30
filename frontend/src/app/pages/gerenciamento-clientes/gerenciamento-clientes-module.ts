import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GerenciamentoClientesRoutingModule } from './gerenciamento-clientes-routing-module';
import { RegistroClientes } from './components/registro-clientes/registro-clientes';
import { ReactiveFormsModule } from '@angular/forms';
import { NgxMaskDirective, NgxMaskPipe, provideNgxMask } from 'ngx-mask';
import { RegistroClientsPage } from './components/registro-clients-page/registro-clients-page';
import { RegistroEmail } from './components/registro-email/registro-email';


@NgModule({
  declarations: [
    RegistroClientes,
    RegistroClientsPage,
    RegistroEmail,
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
