import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistroEndereco } from './registro-endereco';

describe('RegistroEndereco', () => {
  let component: RegistroEndereco;
  let fixture: ComponentFixture<RegistroEndereco>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RegistroEndereco]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegistroEndereco);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
