import { TestBed } from '@angular/core/testing';

import { ApiPotsService } from './api-pots.service';

describe('ApiPotsService', () => {
  let service: ApiPotsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ApiPotsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
