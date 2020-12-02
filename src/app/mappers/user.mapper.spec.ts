import { TestBed } from '@angular/core/testing';
import { USER_BAPI_DATA, USER_DATA } from '../mocks/user-data.mock';
import { UserBapi } from '../models/user-bapi.model';
import { User } from '../models/user-eer.model';
import { UserMapper } from './user.mapper';

describe('UseMapper', () => {
  let mapper: UserMapper;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [UserMapper],
    });

    mapper = TestBed.inject(UserMapper);
  });

  test('should be created', () => {
    expect(mapper).toBeTruthy();
  });

  describe('toDomainModel', () => {
    test('should map from User to UserBapi', () => {
      const formatedUser: UserBapi = mapper.toDomainModel(USER_DATA);
      expect(formatedUser).toStrictEqual(USER_BAPI_DATA);
    });
  });

  describe('toAppModel', () => {
    test('should map from UserBapi to User', () => {
      const formatedUserBapi: User = mapper.toAppModel(USER_BAPI_DATA);
      expect(formatedUserBapi).toStrictEqual(USER_DATA);
    });
  });
});
