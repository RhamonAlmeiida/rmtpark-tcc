import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VagaListaComponent } from './vaga-lista.component';

describe('VagaListaComponent', () => {
  let component: VagaListaComponent;
  let fixture: ComponentFixture<VagaListaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VagaListaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VagaListaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
