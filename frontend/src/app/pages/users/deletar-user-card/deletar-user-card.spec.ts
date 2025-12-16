import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeletarUserCard } from './deletar-user-card';

describe('DeletarUserCard', () => {
  let component: DeletarUserCard;
  let fixture: ComponentFixture<DeletarUserCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DeletarUserCard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeletarUserCard);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
