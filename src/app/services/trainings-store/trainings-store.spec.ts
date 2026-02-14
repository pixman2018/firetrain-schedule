import { TestBed } from '@angular/core/testing';

import { TrainingsStore } from './trainings-store';

describe('TrainingsStore', () => {
  let service: TrainingsStore;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TrainingsStore);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
