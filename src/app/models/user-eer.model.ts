import { FamilySituation } from './typology-eer.model';

export interface User {
  userId: string;
  bankId: string;
  lastName: string;
  firstName: string;
  gender: Gender;
  birthDate: string;
  mobilePhone: string;
  email: string;
  familySituation: FamilySituation;
}

export enum Gender {
  Mme = 'MME',
  Mr = 'MR',
}
