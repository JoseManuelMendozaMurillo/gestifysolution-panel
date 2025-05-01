import { TestBed } from '@angular/core/testing';

import { SharedValidationsService } from './shared-validations.service';

describe('SharedValidatorsService', () => {
  let service: SharedValidationsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SharedValidationsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
