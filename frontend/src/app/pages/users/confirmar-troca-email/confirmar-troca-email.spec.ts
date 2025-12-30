import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmarTrocaEmail } from './confirmar-troca-email';

describe('ConfirmarTrocaEmail', () => {
  let component: ConfirmarTrocaEmail;
  let fixture: ComponentFixture<ConfirmarTrocaEmail>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ConfirmarTrocaEmail]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConfirmarTrocaEmail);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
