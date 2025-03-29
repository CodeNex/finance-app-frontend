import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaginationTransactionsComponent } from './pagination-transactions.component';

describe('PaginationTransactionsComponent', () => {
  let component: PaginationTransactionsComponent;
  let fixture: ComponentFixture<PaginationTransactionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PaginationTransactionsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PaginationTransactionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
