import { TestBed } from '@angular/core/testing';

import { InstitutionSelfRegistrationService } from './institution-self-registration.service';

describe('InstitutionSelfRegistrationService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: InstitutionSelfRegistrationService = TestBed.get(InstitutionSelfRegistrationService);
    expect(service).toBeTruthy();
  });
});
