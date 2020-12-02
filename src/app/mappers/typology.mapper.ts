import { Injectable } from '@angular/core';
import { FamilySituationBapi } from '../models/typology-bapi.model';
import { FamilySituation } from '../models/typology-eer.model';
import { Mapper } from './mapper';

@Injectable()
export class FamilySituationMapper implements Mapper<FamilySituationBapi, FamilySituation> {
  public toDomainModel(familySituation: FamilySituation): FamilySituationBapi {
    return {
      code: familySituation.code,
      label: familySituation.label,
    };
  }
  public toAppModel(familySituationBapi: FamilySituationBapi): FamilySituation {
    return {
      code: familySituationBapi.code,
      label: familySituationBapi.label,
    };
  }

  public toAppModelCollection(familySituationsBapi: FamilySituationBapi[]): FamilySituation[] {
    return familySituationsBapi.map((familySituationBapi) => this.toAppModel(familySituationBapi));
  }
}
