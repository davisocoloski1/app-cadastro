import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UsersRoutingModule } from './users-routing-module';
import { ReactiveFormsModule } from '@angular/forms';
import { MainUserPage } from './main-user-page/main-user-page';


@NgModule({
  declarations: [
  
    MainUserPage
  ],
  imports: [
    CommonModule,
    UsersRoutingModule,
    ReactiveFormsModule
  ]
})
export class UsersModule { }
