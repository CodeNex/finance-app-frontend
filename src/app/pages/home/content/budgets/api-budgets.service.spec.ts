import { TestBed } from '@angular/core/testing';

import { ApiBudgetsService } from './api-budgets.service';

describe('ApiBudgetsService', () => {
  let service: ApiBudgetsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ApiBudgetsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
