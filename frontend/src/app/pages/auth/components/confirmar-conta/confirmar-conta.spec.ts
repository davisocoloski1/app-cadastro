import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmarConta } from './confirmar-conta';

describe('ConfirmarConta', () => {
  let component: ConfirmarConta;
  let fixture: ComponentFixture<ConfirmarConta>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ConfirmarConta]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConfirmarConta);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
