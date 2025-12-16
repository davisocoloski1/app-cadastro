import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UsersRoutingModule } from './users-routing-module';
import { ReactiveFormsModule } from '@angular/forms';
import { MainUserPage } from './main-user-page/main-user-page';
import { AlterarSenha } from './alterar-senha/alterar-senha';
import { DeletarUserCard } from './deletar-user-card/deletar-user-card';


@NgModule({
  declarations: [
  
    MainUserPage,
       AlterarSenha,
       DeletarUserCard
  ],
  imports: [
    CommonModule,
    UsersRoutingModule,
    ReactiveFormsModule
  ]
})
export class UsersModule { }
