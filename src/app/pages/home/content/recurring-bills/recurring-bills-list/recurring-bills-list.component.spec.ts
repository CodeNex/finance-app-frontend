import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecurringBillsListComponent } from './recurring-bills-list.component';

describe('RecurringBillsListComponent', () => {
  let component: RecurringBillsListComponent;
  let fixture: ComponentFixture<RecurringBillsListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RecurringBillsListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RecurringBillsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
