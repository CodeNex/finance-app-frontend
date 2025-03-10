import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LastSpendingComponent } from './last-spending.component';

describe('LastSpendingComponent', () => {
  let component: LastSpendingComponent;
  let fixture: ComponentFixture<LastSpendingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LastSpendingComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LastSpendingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
