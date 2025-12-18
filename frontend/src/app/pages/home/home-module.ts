import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HomeRoutingModule } from './home-routing-module';
import { Home } from './home';
import { ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    Home,
  ],
  imports: [
    CommonModule,
    HomeRoutingModule,
    ReactiveFormsModule,
  ]
})
export class HomeModule { }
