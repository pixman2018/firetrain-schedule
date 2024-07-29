import { TestBed } from '@angular/core/testing';

import { TrainingInWorkoutService } from './training-in-workout.service';

describe('TrainingInWorkoutService', () => {
  let service: TrainingInWorkoutService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TrainingInWorkoutService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
