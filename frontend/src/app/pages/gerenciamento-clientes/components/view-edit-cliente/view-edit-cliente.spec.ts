import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewEditCliente } from './view-edit-cliente';

describe('ViewEditCliente', () => {
  let component: ViewEditCliente;
  let fixture: ComponentFixture<ViewEditCliente>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ViewEditCliente]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewEditCliente);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
