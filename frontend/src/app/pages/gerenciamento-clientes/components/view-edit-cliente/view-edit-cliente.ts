import { Component, OnInit } from '@angular/core';
import { ClienteService } from '../../services/cliente.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-view-edit-cliente',
  standalone: false,
  templateUrl: './view-edit-cliente.html',
  styleUrl: './view-edit-cliente.scss',
})
export class ViewEditCliente implements OnInit {
  clienteToEdit?: any = null
  userId!: number
  
  constructor(
    private clienteService: ClienteService,
    private route: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'))
    this.userId = id
    this.clienteService.getClienteById(id).subscribe({
      next: (res: any) => {
        this.clienteToEdit = res
        console.log(this.clienteToEdit)
        console.log(res)
      }, error: (err: any) => {
        console.log(err.error)
      }
    })
  }
}
