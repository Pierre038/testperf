import { HttpClient } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { MockProvider } from 'ng-mocks';
import { Observable, of } from 'rxjs';
import { UserMapper } from '../mappers/user.mapper';
import { EER_COMMON_CONFIG_DATA } from '../mocks/eerCommonConfig-data.mock';
import { USER_BAPI_DATA, USER_DATA } from '../mocks/user-data.mock';
import { UserBapi } from '../models/user-bapi.model';
import { User } from '../models/user-eer.model';
import { EER_COMMON_PARAMS_TOKEN } from '../tokens/tokens';
import { UserService } from './user.service';

describe('UserService', () => {
  let service: UserService;
  let http: HttpClient;
  let mapper: UserMapper;
  let toAppModelSpy: jest.SpyInstance;
  let toDomainModelSpy: jest.SpyInstance;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        UserService,
        { provide: EER_COMMON_PARAMS_TOKEN, useValue: EER_COMMON_CONFIG_DATA },
        MockProvider(HttpClient),
        MockProvider(UserMapper),
      ],
    });
    service = TestBed.inject(UserService);
    http = TestBed.inject(HttpClient);
    mapper = TestBed.inject(UserMapper);

    toAppModelSpy = jest.spyOn(mapper, 'toAppModel').mockReturnValue(USER_DATA).mockName('toAppModel');

    toDomainModelSpy = jest.spyOn(mapper, 'toDomainModel').mockReturnValue(USER_BAPI_DATA).mockName('toDomainModel');
  });

  test('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('get', () => {
    test('should call corresponding resource and map response to internal model', () => {
      const getResponse: UserBapi = USER_BAPI_DATA;
      const expectedMappedValue: User = USER_DATA;

      const httpGetSpy = jest.spyOn(http, 'get').mockReturnValue(of(getResponse)).mockName('http.get');

      const getResponse$: Observable<User> = service.get(USER_DATA.userId);

      expect(getResponse$).toBeDefined();

      return getResponse$.toPromise().then((mappedValue) => {
        expect(httpGetSpy).toHaveBeenCalledWith(`${EER_COMMON_CONFIG_DATA.urls.User}${USER_DATA.userId}`);
        expect(toAppModelSpy).toHaveBeenCalledWith(getResponse);
        expect(mappedValue).toEqual(expectedMappedValue);
      });
    });
  });

  describe('create', () => {
    test('should map to external model then call corresponding resource and map response to internal model', () => {
      const postResponse: UserBapi = USER_BAPI_DATA;
      const postPayload: UserBapi = USER_BAPI_DATA;
      const userToCreate: User = USER_DATA;
      const expectedMappedValue: User = USER_DATA;

      const httpPostSpy = jest.spyOn(http, 'post').mockReturnValue(of(postResponse)).mockName('http.post');

      const postResponse$: Observable<User> = service.create(userToCreate);

      expect(postResponse$).toBeDefined();

      return postResponse$.toPromise().then((mappedValue) => {
        expect(httpPostSpy).toHaveBeenCalledWith(EER_COMMON_CONFIG_DATA.urls.User, postPayload);
        expect(toDomainModelSpy).toHaveBeenCalledWith(userToCreate);
        expect(toAppModelSpy).toHaveBeenCalledWith(postResponse);
        expect(mappedValue).toEqual(expectedMappedValue);
      });
    });
  });

  describe('update', () => {
    test('should map to external model then call corresponding resource and map response to internal model', () => {
      const patchResponse: UserBapi = USER_BAPI_DATA;
      const patchPayload: UserBapi = USER_BAPI_DATA;
      const userToUpdate: User = USER_DATA;
      const expectedMappedValue: User = USER_DATA;

      const httpPatchSpy = jest.spyOn(http, 'patch').mockReturnValue(of(patchResponse)).mockName('http.patch');

      const patchResponse$: Observable<User> = service.update(userToUpdate);

      expect(patchResponse$).toBeDefined();

      return patchResponse$.toPromise().then((mappedValue) => {
        expect(httpPatchSpy).toHaveBeenCalledWith(EER_COMMON_CONFIG_DATA.urls.User, patchPayload);
        expect(toDomainModelSpy).toHaveBeenCalledWith(userToUpdate);
        expect(toAppModelSpy).toHaveBeenCalledWith(patchResponse);
        expect(mappedValue).toEqual(expectedMappedValue);
      });
    });
  });
});
