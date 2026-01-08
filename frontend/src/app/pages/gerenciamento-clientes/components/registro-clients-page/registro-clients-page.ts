import { Component, inject, OnInit } from '@angular/core';
import { Cliente } from '../../models/cliente';
import { StepperService } from '../../services/stepper.service';

@Component({
  selector: 'app-registro-clients-page',
  standalone: false,
  templateUrl: './registro-clients-page.html',
  styleUrl: './registro-clients-page.scss',
})
export class RegistroClientsPage implements OnInit {
  formLiberado = false
  clienteFormPreenchido = true
  contatoFormPreenchido = true
  enderecoFormPreenchido = true
  cliente?: Cliente
  idCliente?: number
  stateMsg = ''
  step = 1

  stepper = inject(StepperService)

  ngOnInit(): void {
    this.stepper.clear()
  }

  next() {
    if (this.step < 5) this.step++
  }

  back() {
    if (this.step > 1) this.step--
  }

  onClienteRegistrado(body: any) {
    this.cliente = body.cliente
    this.idCliente = body.cliente_id
    this.stateMsg = 'Caso recarregue ou saia da página, os dados serão perdidos.\nEm caso de cliente registrado, as informações de contato e endereço só poderão ser editadas na página de edição de cliente.'

    setTimeout(() => { this.step++ }, 2000)
  }
}
