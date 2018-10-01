import { TestBed, inject } from '@angular/core/testing';

import { PermalinkService } from './permalink.service';

describe('PermalinkService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PermalinkService]
    });
  });

  it('should be created', inject([PermalinkService], (service: PermalinkService) => {
    expect(service).toBeTruthy();
  }));
});
