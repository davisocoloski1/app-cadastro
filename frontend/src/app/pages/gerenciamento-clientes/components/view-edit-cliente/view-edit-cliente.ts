import { Component, OnInit } from '@angular/core';
import { ClienteService } from '../../services/cliente.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-view-edit-cliente',
  standalone: false,
  templateUrl: './view-edit-cliente.html',
  styleUrl: './view-edit-cliente.scss',
})
export class ViewEditCliente implements OnInit {
  clienteToEdit?: any = null
  userId!: number
  emailSuccessMsg = ''
  emailErrorMsg = ''
  telefoneSuccessMsg = ''
  telefoneErrorMsg = ''
  enderecoSuccessMsg = ''
  enderecoErrorMsg = ''
  clienteSuccessMsg = ''
  clienteErrorMsg = ''
  emailIdToDelete: number | null = null
  telefoneIdToDelete: number | null = null
  enderecoIdToDelete: number | null = null
  clienteIdToDelete: number | null = null
  
  constructor(
    private clienteService: ClienteService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.getClientes()
  }

  alternarStatus(id: number, status: boolean) {
    const newStatus = status ? 'desativar' : 'ativar'
    this.clienteService.alternarStatusCliente(id, newStatus).subscribe({
      next: (res: any) => {
        this.clienteErrorMsg = ''
        this.clienteSuccessMsg = res.message
        
        setTimeout(() => { 
          this.getClientes() 
          this.clienteIdToDelete = null
        }, 2000)

        setTimeout(() => {
          this.clienteSuccessMsg = ''
          this.clienteErrorMsg = ''
        }, 6000)
      },
      error: (err: any) => {
        this.clienteSuccessMsg = ''
        this.clienteErrorMsg = err.error.message || err.error
        setTimeout(() => {
          this.clienteErrorMsg = ''
        }, 6000)
      }
    })
  }

  desativarParcial(id: number, type: string, targetId: number, status: string) {
    this.clienteService.desativarParcial(id, type, targetId, status).subscribe({
      next: (res: any) => {
        this.enderecoErrorMsg = ''
        this.emailErrorMsg = '' 
        this.telefoneErrorMsg = ''
        const successMessage = res.message

        setTimeout(() => {
          if (successMessage.includes('E-mail')) {
            this.emailSuccessMsg = res.message
            this.emailIdToDelete = null
          } else if (successMessage.includes('Telefone')) {
            this.telefoneSuccessMsg = res.message
            this.telefoneIdToDelete = null
          } else if (successMessage.includes('Endereço')) {
            this.enderecoSuccessMsg = res.message
            this.enderecoIdToDelete = null
          }
          
          this.getClientes()
        }, 2000)

        setTimeout(() => {
          this.enderecoErrorMsg = ''
          this.emailErrorMsg = '' 
          this.telefoneErrorMsg = ''
          this.enderecoSuccessMsg = ''
          this.emailSuccessMsg = ''
          this.telefoneSuccessMsg = ''
        }, 6000)
        
      }, error: (err: any) => {
        this.enderecoSuccessMsg = ''
        this.emailSuccessMsg = ''
        this.telefoneSuccessMsg = ''
        const errorMessage = err.error?.message || err.error

        if (errorMessage.includes('e-mail')) {
          this.emailErrorMsg = err.error.message
        }
        if (errorMessage.includes('telefone')) {
          this.telefoneErrorMsg = err.error.message
        } if (errorMessage.includes('endereço')) {
          this.enderecoErrorMsg = err.error.message
        }
      }
    })
  }

  editar(id: number, obj: any, type: string, editing: boolean) {
    this.router.navigate(['/clientes/editar-cliente', type, id, editing], {
      state: { data: Array.isArray(obj) ? obj : [obj] }
    })
  }

  private getClientes() {
    const id = Number(this.route.snapshot.paramMap.get('id'))
    this.userId = id
    this.clienteService.getClienteById(id).subscribe({
      next: (res: any) => {
        this.clienteToEdit = res
      }, error: (err: any) => {
        console.log(err.error)
      }
    })
  }
}
