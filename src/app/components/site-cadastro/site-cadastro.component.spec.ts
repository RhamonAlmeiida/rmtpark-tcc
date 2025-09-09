import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SiteCadastroComponent } from './site-cadastro.component';

describe('SiteCadastroComponent', () => {
  let component: SiteCadastroComponent;
  let fixture: ComponentFixture<SiteCadastroComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SiteCadastroComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SiteCadastroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
