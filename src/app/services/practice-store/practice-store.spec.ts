import { TestBed } from '@angular/core/testing';

import { PracticeStore } from './practice-store';

describe('PracticeStore', () => {
  let service: PracticeStore;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PracticeStore);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
