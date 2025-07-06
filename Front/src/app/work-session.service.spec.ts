import { TestBed } from '@angular/core/testing';

import { WorkSessionService } from './work-session.service';

describe('WorkSessionService', () => {
  let service: WorkSessionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WorkSessionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
