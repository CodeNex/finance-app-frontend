import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpendingSummaryItemComponent } from './spending-summary-item.component';

describe('SpendingSummaryItemComponent', () => {
  let component: SpendingSummaryItemComponent;
  let fixture: ComponentFixture<SpendingSummaryItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SpendingSummaryItemComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SpendingSummaryItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
