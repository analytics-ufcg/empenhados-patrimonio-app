import { TestBed, inject } from '@angular/core/testing';

import { VisPatrimonioService } from './vis-patrimonio.service';

describe('VisPatrimonioService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [VisPatrimonioService]
    });
  });

  it('should be created', inject([VisPatrimonioService], (service: VisPatrimonioService) => {
    expect(service).toBeTruthy();
  }));
});
