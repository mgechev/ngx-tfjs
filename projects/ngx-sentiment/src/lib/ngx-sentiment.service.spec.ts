import { TestBed } from '@angular/core/testing';

import { NgxSentimentService } from './ngx-sentiment.service';

describe('NgxSentimentService', () => {
  let service: NgxSentimentService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NgxSentimentService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
