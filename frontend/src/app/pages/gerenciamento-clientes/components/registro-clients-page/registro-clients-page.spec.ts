import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistroClientsPage } from './registro-clients-page';

describe('RegistroClientsPage', () => {
  let component: RegistroClientsPage;
  let fixture: ComponentFixture<RegistroClientsPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RegistroClientsPage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegistroClientsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
