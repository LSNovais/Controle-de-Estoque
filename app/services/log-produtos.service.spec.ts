import { TestBed } from '@angular/core/testing';

import { LogProdutosService } from './log-produtos.service';

describe('LogProdutosService', () => {
  let service: LogProdutosService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LogProdutosService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
