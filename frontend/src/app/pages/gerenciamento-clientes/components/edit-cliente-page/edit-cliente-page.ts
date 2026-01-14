import { Component, OnInit } from '@angular/core';
import { ClienteService } from '../../services/cliente.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';

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
  isEditing!: boolean
  
  constructor(
    private clienteService: ClienteService,
    private route: ActivatedRoute,
    private router: Router,
    private location: Location
  ) {}
  
  ngOnInit(): void {
    this.tipo = this.route.snapshot.paramMap.get('tipo') ?? ''
    this.id = Number(this.route.snapshot.paramMap.get('id'))
    this.isEditing = this.route.snapshot.paramMap.get('editing') === 'true'
    
    this.contatoToEdit = history.state.data
  }

  onFormEnviado(event: any) {
    let sucesso = false;

    if (event && typeof event === 'object' && ('email' in event || 'tel' in event)) {
      sucesso = event.email && event.tel;
    } else {
      sucesso = event === true;
    }

    if (sucesso) {
      setTimeout(() => {
        this.location.back();
      }, 1500);
    }
  }
}
