import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MainUserPage } from './main-user-page';

describe('MainUserPage', () => {
  let component: MainUserPage;
  let fixture: ComponentFixture<MainUserPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MainUserPage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MainUserPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
