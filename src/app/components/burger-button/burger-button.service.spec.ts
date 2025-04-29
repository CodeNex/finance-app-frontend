import { TestBed } from '@angular/core/testing';

import { BurgerButtonService } from './burger-button.service';

describe('BurgerButtonService', () => {
  let service: BurgerButtonService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BurgerButtonService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
