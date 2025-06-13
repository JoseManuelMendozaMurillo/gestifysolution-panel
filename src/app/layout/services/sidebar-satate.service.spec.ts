import { TestBed } from '@angular/core/testing';

import { SidebarSatateService } from './sidebar-satate.service';

describe('SidebarSatateService', () => {
  let service: SidebarSatateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SidebarSatateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
