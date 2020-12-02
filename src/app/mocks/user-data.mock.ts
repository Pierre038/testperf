import { CIVILITY_MR, UserBapi } from '../models/user-bapi.model';
import { Gender, User } from '../models/user-eer.model';

export const USER_DATA: User = {
  userId: '12345',
  bankId: '18315',
  firstName: 'Martin',
  lastName: 'Dupont',
  gender: Gender.Mr,
  birthDate: '09/08/1987',
  mobilePhone: '0612131415',
  email: 'martin.dupont@mail.com',
  familySituation: { code: '1', label: 'Célibataire' },
};

export const USER_BAPI_DATA: UserBapi = {
  identification: {
    personId: {
      id: '12345',
      entityCode: '18315',
    },
    firstName: 'Martin',
    lastName: 'Dupont',
    birthDate: '09/08/1987',
    civility: CIVILITY_MR,
    legalSituation: { code: '1', label: 'Célibataire' },
  },
  communication: {
    phoneNumber: '0612131415',
    email: 'martin.dupont@mail.com',
  },
};
