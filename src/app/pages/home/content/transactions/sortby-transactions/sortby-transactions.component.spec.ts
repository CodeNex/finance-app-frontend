import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SortbyTransactionsComponent } from './sortby-transactions.component';

describe('SortbyTransactionsComponent', () => {
  let component: SortbyTransactionsComponent;
  let fixture: ComponentFixture<SortbyTransactionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SortbyTransactionsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SortbyTransactionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
