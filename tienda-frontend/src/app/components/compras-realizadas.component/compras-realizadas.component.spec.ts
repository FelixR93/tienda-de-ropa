import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComprasRealizadasComponent } from './compras-realizadas.component';

describe('ComprasRealizadasComponent', () => {
  let component: ComprasRealizadasComponent;
  let fixture: ComponentFixture<ComprasRealizadasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ComprasRealizadasComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ComprasRealizadasComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
