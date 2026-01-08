import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinalizarRegistro } from './finalizar-registro';

describe('FinalizarRegistro', () => {
  let component: FinalizarRegistro;
  let fixture: ComponentFixture<FinalizarRegistro>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FinalizarRegistro]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FinalizarRegistro);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
