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
  emailIdToDelete: number | null = null
  telefoneIdToDelete: number | null = null
  enderecoIdToDelete: number | null = null
  
  constructor(
    private clienteService: ClienteService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.getClientes()
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

  editar(id: number, obj: any, type: string) {
    this.router.navigate(['/clientes/editar-cliente', type, id], {
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
