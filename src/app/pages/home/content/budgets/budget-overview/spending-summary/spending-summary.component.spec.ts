import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpendingSummaryComponent } from './spending-summary.component';

describe('SpendingSummaryComponent', () => {
  let component: SpendingSummaryComponent;
  let fixture: ComponentFixture<SpendingSummaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SpendingSummaryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SpendingSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
