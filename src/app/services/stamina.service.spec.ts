import { TestBed } from '@angular/core/testing';

import { StaminaService } from './stamina.service';

describe('StaminaService', () => {
  let service: StaminaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StaminaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
