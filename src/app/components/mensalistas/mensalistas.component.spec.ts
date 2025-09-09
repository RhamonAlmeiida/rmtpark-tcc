import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MensalistasComponent } from './mensalistas.component';

describe('MensalistasComponent', () => {
  let component: MensalistasComponent;
  let fixture: ComponentFixture<MensalistasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MensalistasComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MensalistasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
