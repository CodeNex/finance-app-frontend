import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CategoryfilterTransactionsComponent } from './categoryfilter-transactions.component';

describe('CategoryfilterTransactionsComponent', () => {
  let component: CategoryfilterTransactionsComponent;
  let fixture: ComponentFixture<CategoryfilterTransactionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CategoryfilterTransactionsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CategoryfilterTransactionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
