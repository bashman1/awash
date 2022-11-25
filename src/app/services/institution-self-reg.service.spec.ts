import { TestBed } from '@angular/core/testing';

import { InstitutionSelfRegService } from './institution-self-reg.service';

describe('InstitutionSelfRegService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: InstitutionSelfRegService = TestBed.get(InstitutionSelfRegService);
    expect(service).toBeTruthy();
  });
});
