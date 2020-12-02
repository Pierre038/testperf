import { HttpClient } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { MockProvider } from 'ng-mocks';
import { EdeMapper } from '../mappers/ede.mapper';
import { EER_COMMON_CONFIG_DATA } from '../mocks/eerCommonConfig-data.mock';
import { EER_COMMON_PARAMS_TOKEN } from '../tokens/tokens';
import { IdentificationService } from './identification.service';

describe('IdentificationService', () => {
  let service: IdentificationService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        IdentificationService,
        { provide: EER_COMMON_PARAMS_TOKEN, useValue: EER_COMMON_CONFIG_DATA },
        MockProvider(HttpClient),
        MockProvider(EdeMapper),
      ],
    });
    service = TestBed.inject(IdentificationService);
  });

  test('should be created', () => {
    expect(service).toBeTruthy();
  });
});
