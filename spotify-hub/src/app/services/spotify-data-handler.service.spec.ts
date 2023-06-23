import { TestBed } from '@angular/core/testing';

import { SpotifyDataHandlerService } from './spotify-data-handler.service';

describe('SpotifyDataHandlerService', () => {
  let service: SpotifyDataHandlerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SpotifyDataHandlerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
