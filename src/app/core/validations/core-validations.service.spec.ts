import { TestBed } from '@angular/core/testing';

import { CoreValidationsService } from './core-validations.service';

describe('CoreValidationsService', () => {
  let service: CoreValidationsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CoreValidationsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
