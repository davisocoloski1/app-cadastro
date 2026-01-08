import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListagemClientes } from './listagem-clientes';

describe('ListagemClientes', () => {
  let component: ListagemClientes;
  let fixture: ComponentFixture<ListagemClientes>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ListagemClientes]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListagemClientes);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
