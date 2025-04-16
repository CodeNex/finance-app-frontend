import { TestBed } from '@angular/core/testing';

import { BudgetCalculationsService } from './budget-calculations.service';

describe('BudgetCalculationsService', () => {
  let service: BudgetCalculationsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BudgetCalculationsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
