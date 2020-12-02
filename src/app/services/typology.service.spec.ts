import { HttpClient } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { MockProvider } from 'ng-mocks';
import { Observable, of } from 'rxjs';
import { FamilySituationMapper } from '../mappers/typology.mapper';
import { FAMILY_SITUATION_COLLECTION, FAMILY_SITUATION_COLLECTION_BAPI } from '../mocks/typology-data.mock';
import { FamilySituationBapi } from '../models/typology-bapi.model';
import { FamilySituation } from '../models/typology-eer.model';
import { EER_COMMON_PARAMS_TOKEN } from '../tokens/tokens';
import { EER_COMMON_CONFIG_DATA } from './../mocks/eerCommonConfig-data.mock';
import { TypologyService } from './typology.service';

describe('TypologyService', () => {
  let service: TypologyService;
  let http: HttpClient;
  let mapper: FamilySituationMapper;
  let toAppModelSpy: jest.SpyInstance;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        TypologyService,
        { provide: EER_COMMON_PARAMS_TOKEN, useValue: EER_COMMON_CONFIG_DATA },
        MockProvider(HttpClient),
        MockProvider(FamilySituationMapper),
      ],
    });
    service = TestBed.inject(TypologyService);
    http = TestBed.inject(HttpClient);
    mapper = TestBed.inject(FamilySituationMapper);
    toAppModelSpy = jest
      .spyOn(mapper, 'toAppModelCollection')
      .mockReturnValue(FAMILY_SITUATION_COLLECTION)
      .mockName('toAppModelCollection');
  });

  test('should be created', () => {
    expect(service).toBeTruthy();
  });
  // describe('getFamilySituation', () => {
  //   test('should call the bapi with the right url for getFamilySituation', () => {
  //     const expectedBapiResponse: FamilySituationBapi[] = FAMILY_SITUATION_COLLECTION_BAPI;
  //     const expectedMaritalSituations: FamilySituation[] = FAMILY_SITUATION_COLLECTION;

  //     const expectedUrl = `${EER_COMMON_CONFIG_DATA.urls.Typology}/familySituation`;
  //     const httpGetSpy = jest.spyOn(http, 'get').mockReturnValue(of(expectedBapiResponse)).mockName('http.get');

  //     const getResponse$: Observable<FamilySituationBapi[]> = service.getMaritalSituations();

  //     expect(getResponse$).toBeDefined();

  //     return getResponse$.toPromise().then((mappedValue) => {
  //       expect(httpGetSpy).toHaveBeenCalledWith(expectedUrl);
  //       expect(toAppModelSpy).toHaveBeenCalledWith(expectedBapiResponse);
  //       expect(mappedValue).toEqual(expectedMaritalSituations);
  //     });
  //   });
  // });
});
