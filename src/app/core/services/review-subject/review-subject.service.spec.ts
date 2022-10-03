import { TestBed } from '@angular/core/testing';

import { ReviewSubjectService } from './review-subject.service';

describe('ReviewSubjectService', () => {
  let service: ReviewSubjectService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ReviewSubjectService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
