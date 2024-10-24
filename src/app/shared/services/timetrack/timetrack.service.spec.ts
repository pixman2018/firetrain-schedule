import { TestBed } from '@angular/core/testing';

import { TimetrackService } from './timetrack.service';

describe('TimetrackService', () => {
  let service: TimetrackService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TimetrackService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
