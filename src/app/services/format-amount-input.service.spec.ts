import { TestBed } from '@angular/core/testing';

import { FormatAmountInputService } from './format-amount-input.service';

describe('FormatAmountInputService', () => {
  let service: FormatAmountInputService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FormatAmountInputService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
