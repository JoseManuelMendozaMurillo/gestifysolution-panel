import { TestBed } from '@angular/core/testing';

import { BossesAsyncValidationsService } from './bosses-async-validations.service';

describe('BossesAsyncValidationsService', () => {
  let service: BossesAsyncValidationsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BossesAsyncValidationsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
