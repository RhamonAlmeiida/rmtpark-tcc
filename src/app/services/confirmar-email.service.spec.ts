import { TestBed } from '@angular/core/testing';

import { ConfirmarEmailService } from './confirmar-email.service';

describe('ConfirmarEmailService', () => {
  let service: ConfirmarEmailService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ConfirmarEmailService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
