import { TestBed } from '@angular/core/testing';
import { CanMatchFn } from '@angular/router';

import { notAuthenticatedGuard } from './not-authenticated.guard';

describe('notAuthenticatedGuard', () => {
  const executeGuard: CanMatchFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => notAuthenticatedGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
