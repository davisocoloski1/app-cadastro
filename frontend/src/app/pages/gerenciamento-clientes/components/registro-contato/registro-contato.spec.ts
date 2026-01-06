import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistroContato } from './registro-contato';

describe('RegistroContato', () => {
  let component: RegistroContato;
  let fixture: ComponentFixture<RegistroContato>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RegistroContato]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegistroContato);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
