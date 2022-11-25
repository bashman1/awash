import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { InstitutionSelfRegistrationTabPage } from './institution-self-registration-tab.page';

describe('InstitutionSelfRegistrationTabPage', () => {
  let component: InstitutionSelfRegistrationTabPage;
  let fixture: ComponentFixture<InstitutionSelfRegistrationTabPage>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ InstitutionSelfRegistrationTabPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InstitutionSelfRegistrationTabPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
