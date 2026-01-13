import { Component, OnInit } from '@angular/core';
import { ClienteService } from '../../services/cliente.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-edit-cliente-page',
  standalone: false,
  templateUrl: './edit-cliente-page.html',
  styleUrl: './edit-cliente-page.scss',
})
export class EditClientePage implements OnInit {
  tipo!: string
  id!: number
  contatoToEdit: null = null

  constructor(
    private clienteService: ClienteService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.tipo = this.route.snapshot.paramMap.get('tipo') ?? ''
    this.id = Number(this.route.snapshot.paramMap.get('id'))

    this.contatoToEdit = history.state.data
  }
}
