import { TestBed } from '@angular/core/testing';

import { SiteCadastroService } from './site-cadastro.service';

describe('SiteCadastroService', () => {
  let service: SiteCadastroService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SiteCadastroService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
