import { TestBed } from '@angular/core/testing';

import { ClipboardServiceService } from './clipboard-service.service';

describe('ClipboardServiceService', () => {
  let service: ClipboardServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ClipboardServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
