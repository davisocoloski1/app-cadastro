import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminRegistroPage } from './admin-registro-page';

describe('AdminRegistroPage', () => {
  let component: AdminRegistroPage;
  let fixture: ComponentFixture<AdminRegistroPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AdminRegistroPage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminRegistroPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
