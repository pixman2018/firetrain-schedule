import { TestBed } from '@angular/core/testing';

import { exercisesStore } from './exercises-store';

describe('exercisesStore', () => {
  let service: exercisesStore;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(exercisesStore);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
