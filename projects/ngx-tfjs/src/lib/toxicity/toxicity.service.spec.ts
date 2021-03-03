import { TestBed } from '@angular/core/testing';

import { ToxicityService } from './toxicity.service';

describe('SentimentService', () => {
  let service: ToxicityService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ToxicityService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should throw when not initialized', async () => {
    let threw = false;
    try {
      await service.classify([])
    } catch {
      threw = true;
    }
    expect(threw).toBeTrue();

    await service.init(0.4);

    threw = false;
    try {
      await service.classify([])
    } catch {
      threw = true;
    }
    expect(threw).toBeFalse();
  });
});
