import { TestBed } from '@angular/core/testing';

import { MarhubApiServiceService } from './marhub-api-service.service';

describe('MarhubApiServiceService', () => {
  let service: MarhubApiServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MarhubApiServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
