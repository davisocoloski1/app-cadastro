import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ClienteService } from '../../services/cliente.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-registro-email',
  standalone: false,
  templateUrl: './registro-email.html',
  styleUrl: './registro-email.scss',
})
export class RegistroEmail {
  emailForm!: FormGroup

  constructor(
    private fb: FormBuilder,
    private clienteService: ClienteService,
    private router: Router
  ) {
    
  }
}
