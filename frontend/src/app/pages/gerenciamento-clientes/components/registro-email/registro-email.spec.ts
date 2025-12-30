import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistroEmail } from './registro-email';

describe('RegistroEmail', () => {
  let component: RegistroEmail;
  let fixture: ComponentFixture<RegistroEmail>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RegistroEmail]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegistroEmail);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
