import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VagaCadastroComponent } from './vaga-cadastro.component';

describe('VagaCadastroComponent', () => {
  let component: VagaCadastroComponent;
  let fixture: ComponentFixture<VagaCadastroComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VagaCadastroComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VagaCadastroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
