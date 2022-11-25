import { TestBed } from '@angular/core/testing';

import { LoanDetailsService } from './loan-details.service';

describe('LoanDetailsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: LoanDetailsService = TestBed.get(LoanDetailsService);
    expect(service).toBeTruthy();
  });
});
