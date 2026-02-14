import { TestBed } from '@angular/core/testing';

import { DbUpdate } from './db-update';

describe('DbUpdate', () => {
  let service: DbUpdate;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DbUpdate);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
