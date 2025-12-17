import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminRegistro } from './admin-registro';

describe('AdminRegistro', () => {
  let component: AdminRegistro;
  let fixture: ComponentFixture<AdminRegistro>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AdminRegistro]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminRegistro);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
