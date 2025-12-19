import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UsersRoutingModule } from './users-routing-module';
import { ReactiveFormsModule } from '@angular/forms';
import { MainUserPage } from './main-user-page/main-user-page';
import { AlterarSenha } from './alterar-senha/alterar-senha';
import { DeletarUserCard } from './deletar-user-card/deletar-user-card';
import { AdminRegistro } from './main-user-page/admin-registro/admin-registro';
import { AdminRegistroPage } from './admin-registro-page/admin-registro-page';


@NgModule({
  declarations: [
  
    MainUserPage,
       AlterarSenha,
       DeletarUserCard,
       AdminRegistro,
       AdminRegistroPage
  ],
  imports: [
    CommonModule,
    UsersRoutingModule,
    ReactiveFormsModule
  ]
})
export class UsersModule { }
