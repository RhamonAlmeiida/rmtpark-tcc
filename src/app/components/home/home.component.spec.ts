import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HomeComponent } from './home.component';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomeComponent, RouterTestingModule]
    }).compileComponents();

    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have planos property with 3 plans', () => {
    expect(component.planos.length).toBe(3);
  });

  it('should have depoimentos property with testimonials', () => {
    expect(component.depoimentos.length).toBeGreaterThan(0);
  });

  it('should have recursos property with features', () => {
    expect(component.recursos.length).toBeGreaterThan(0);
  });
});