import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecurringDeleteModalComponent } from './recurring-delete-modal.component';

describe('RecurringDeleteModalComponent', () => {
  let component: RecurringDeleteModalComponent;
  let fixture: ComponentFixture<RecurringDeleteModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RecurringDeleteModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RecurringDeleteModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
