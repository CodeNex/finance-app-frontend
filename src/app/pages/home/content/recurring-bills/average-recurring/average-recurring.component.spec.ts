import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AverageRecurringComponent } from './average-recurring.component';

describe('AverageRecurringComponent', () => {
  let component: AverageRecurringComponent;
  let fixture: ComponentFixture<AverageRecurringComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AverageRecurringComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AverageRecurringComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
