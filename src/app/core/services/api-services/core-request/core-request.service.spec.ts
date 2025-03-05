import { TestBed } from '@angular/core/testing';

import { CoreRequestService } from './core-request.service';

describe('CoreRequestService', () => {
  let service: CoreRequestService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CoreRequestService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
