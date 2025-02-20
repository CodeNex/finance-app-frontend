import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteBudgetModalComponent } from './delete-budget-modal.component';

describe('DeleteBudgetModalComponent', () => {
  let component: DeleteBudgetModalComponent;
  let fixture: ComponentFixture<DeleteBudgetModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeleteBudgetModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeleteBudgetModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
