import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RegistroRoutingModule } from './registro-routing-module';
import { ReactiveFormsModule } from '@angular/forms';
import { Registro } from './components/registro/registro';


@NgModule({
  declarations: [
    Registro
  ],
  imports: [
    CommonModule,
    RegistroRoutingModule,
    ReactiveFormsModule
  ]
})
export class RegistroModule { }
