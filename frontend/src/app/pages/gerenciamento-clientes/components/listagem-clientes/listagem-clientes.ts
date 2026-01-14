import { Component, OnInit } from '@angular/core';
import { ClienteService } from '../../services/cliente.service';
import { Cliente } from '../../models/cliente';
import { Email } from '../../models/email';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-listagem-clientes',
  standalone: false,
  templateUrl: './listagem-clientes.html',
  styleUrl: './listagem-clientes.scss',
})
export class ListagemClientes implements OnInit {
  clientes: any = []

  clienteIdToDelete: number | null = null

  successMsg = ''
  errorMsg = ''
  searchBar = new FormControl('')
  searchPlaceholder = 'Buscar por nome, CPF/CNPJ, e-mail ou telefone'

  constructor(
    private clienteService: ClienteService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.listarClientes()
  }

  listarClientes() {
    this.clienteService.indexClientes().subscribe({
      next: (res: any) => {
        this.clientes = res
      }
    })
  }
  
  search() {
    if (this.searchBar.value?.trim() === '') {
      this.searchPlaceholder = 'Nada para pesquisar...'

      setTimeout(() => {
        this.searchPlaceholder = 'Buscar por nome, CPF/CNPJ, e-mail ou telefone'
      }, 3000)
    } else {
      this.clienteService.pesquisarClientes(this.searchBar.value!).subscribe({
        next: (res: any) => this.clientes = res,
        error: (err: any) => {
          if (err.error.message) {
            this.errorMsg = err.error.message
          } else {
            this.errorMsg = err.error
          }
        }
      })
    }
  }

  resetarBusca() {
    this.listarClientes()
  }

  editar(id: number) {
    this.router.navigate(['/clientes/visualizar-cliente', id])
  }

  alternarStatus(id: number, status: boolean) {
    const newStatus = status ? 'desativar' : 'ativar'
    this.clienteService.alternarStatusCliente(id, newStatus).subscribe({
      next: (res: any) => {
        this.errorMsg = ''
        this.successMsg = res.message
        
        setTimeout(() => { 
          this.listarClientes() 
          this.clienteIdToDelete = null
        }, 2000)
      },
      error: (err: any) => {
        this.successMsg = ''
        this.errorMsg = err.error.message || err.error
      }
    })
  }
}
