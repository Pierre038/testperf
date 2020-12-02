import { Injectable } from '@angular/core';
import { Civility, CIVILITY_MME, CIVILITY_MR, UserBapi } from '../models/user-bapi.model';
import { Gender, User } from '../models/user-eer.model';
import { Mapper } from './mapper';

@Injectable()
export class UserMapper implements Mapper<UserBapi, User> {
  public toDomainModel(eerUser: User): UserBapi {
    return {
      identification: {
        personId: {
          id: eerUser.userId,
          entityCode: eerUser.bankId,
        },
        firstName: eerUser.firstName,
        lastName: eerUser.lastName,
        birthDate: eerUser.birthDate,
        civility: this.GenderToCivility(eerUser.gender),
        legalSituation: eerUser.familySituation,
      },
      communication: {
        email: eerUser.email,
        phoneNumber: eerUser.mobilePhone,
      },
    };
  }

  public toAppModel(userBapi: UserBapi): User {
    return {
      userId: userBapi.identification.personId.id,
      bankId: userBapi.identification.personId.entityCode,
      firstName: userBapi.identification.firstName,
      lastName: userBapi.identification.lastName,
      gender: this.CivilityToGender(userBapi.identification.civility),
      birthDate: userBapi.identification.birthDate,
      email: userBapi.communication.email,
      mobilePhone: userBapi.communication.phoneNumber,
      familySituation: userBapi.identification.legalSituation,
    };
  }

  private CivilityToGender(civility: Civility): Gender {
    return civility === CIVILITY_MR ? Gender.Mr : Gender.Mme;
  }
  private GenderToCivility(gender: Gender): Civility {
    return gender === Gender.Mr ? CIVILITY_MR : CIVILITY_MME;
  }
}
