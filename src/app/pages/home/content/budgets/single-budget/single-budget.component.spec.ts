import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SingleBudgetComponent } from './single-budget.component';

describe('SingleBudgetComponent', () => {
  let component: SingleBudgetComponent;
  let fixture: ComponentFixture<SingleBudgetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SingleBudgetComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SingleBudgetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
