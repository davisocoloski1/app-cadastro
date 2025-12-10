import { Component, OnInit } from '@angular/core';
import { RegistroService } from '../../services/registro.service';
import { RegistroModel } from '../../models/registro.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-registro',
  standalone: false,
  templateUrl: './registro.html',
  styleUrl: './registro.scss',
})
export class Registro implements OnInit {
  form!: FormGroup
  constructor(
    private registroService: RegistroService,
    private fb: FormBuilder
  ) {
    this.form = this.fb.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.required]],
      telefone: ['', [Validators.required]],
      password: ['', [Validators.required]],

      wppCheckbox: [false],
      emailCheckbox: [false]
    })
  }

  ngOnInit(): void {
    this.form.get('wppCheckbox')?.valueChanges.subscribe(value => {
      if (value) {
        this.form.get('emailCheckbox')?.patchValue(false, { emitEvent: false });
      }
    });

    this.form.get('emailCheckbox')?.valueChanges.subscribe(value => {
      if (value) {
        this.form.get('wppCheckbox')?.patchValue(false, { emitEvent: false });
      }
    });
  }

  registro() {
    const data: RegistroModel = {
      name: this.form.value.name,
      email: this.form.value.email,
      telefone: this.form.value.telefone,
      password: this.form.value.password
    }

    this.registroService.registro(data).subscribe({
      next: (res: any) => {
        console.log(res)
      },
      error: (err: any) => console.log(err)
    })
  }
}
