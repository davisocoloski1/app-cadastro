import { Component } from '@angular/core';

@Component({
  selector: 'app-registro-clients-page',
  standalone: false,
  templateUrl: './registro-clients-page.html',
  styleUrl: './registro-clients-page.scss',
})
export class RegistroClientsPage {
  formLiberado = true
  clienteFormPreenchido = false
  contatoFormPreenchido = false
  enderecoFormPreenchido = false
  step = 1

  next() {
    if (this.step < 5) this.step++
  }

  back() {
    if (this.step > 1) this.step--
  }
}
