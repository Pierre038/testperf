import { FamilySituationBapi } from '../models/typology-bapi.model';
import { FamilySituation } from '../models/typology-eer.model';

export const FAMILY_SITUATION_CELIBATAIRE: FamilySituation = {
  code: '1',
  label: 'Célibataire',
};

export const FAMILY_SITUATION_MARIE: FamilySituation = {
  code: '2',
  label: 'Marié(e)',
};

export const FAMILY_SITUATION_COLLECTION: FamilySituation[] = [FAMILY_SITUATION_CELIBATAIRE, FAMILY_SITUATION_MARIE];

export const FAMILY_SITUATION_CELIBATAIRE_BAPI: FamilySituationBapi = {
  code: '1',
  label: 'Célibataire',
};

export const FAMILY_SITUATION_MARIE_BAPI: FamilySituationBapi = {
  code: '2',
  label: 'Marié(e)',
};

export const FAMILY_SITUATION_COLLECTION_BAPI: FamilySituationBapi[] = [FAMILY_SITUATION_CELIBATAIRE_BAPI, FAMILY_SITUATION_MARIE_BAPI];
