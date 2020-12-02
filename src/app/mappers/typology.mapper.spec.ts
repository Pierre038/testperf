import { TestBed } from '@angular/core/testing';
import {
  FAMILY_SITUATION_CELIBATAIRE,
  FAMILY_SITUATION_CELIBATAIRE_BAPI,
  FAMILY_SITUATION_COLLECTION,
  FAMILY_SITUATION_COLLECTION_BAPI,
} from '../mocks/typology-data.mock';
import { FamilySituationBapi } from '../models/typology-bapi.model';
import { FamilySituation } from '../models/typology-eer.model';
import { FamilySituationMapper } from './typology.mapper';

describe('FamilySituationMapper', () => {
  let mapper: FamilySituationMapper;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [FamilySituationMapper],
    });
    mapper = TestBed.inject(FamilySituationMapper);
  });

  test('should be created', () => {
    expect(mapper).toBeTruthy();
  });

  describe('toDomainModel', () => {
    test('should map from FamilySituation to FamilySituationBapi', () => {
      const formatedFamilySituationBapi: FamilySituationBapi = mapper.toDomainModel(FAMILY_SITUATION_CELIBATAIRE);
      expect(formatedFamilySituationBapi).toStrictEqual(FAMILY_SITUATION_CELIBATAIRE_BAPI);
    });
  });

  describe('toAppModel', () => {
    test('should map from FamilySituationBapi to FamilySituation', () => {
      const formatedFamilySituation: FamilySituation = mapper.toAppModel(FAMILY_SITUATION_CELIBATAIRE_BAPI);
      expect(formatedFamilySituation).toStrictEqual(FAMILY_SITUATION_CELIBATAIRE);
    });
  });

  describe('toAppModelCollection', () => {
    test('should map from bapiTypoCollection to typoCollection', () => {
      const formatedFamilySituationCollection: FamilySituation[] = mapper.toAppModelCollection(FAMILY_SITUATION_COLLECTION_BAPI);
      expect(formatedFamilySituationCollection).toStrictEqual(FAMILY_SITUATION_COLLECTION);
    });
  });
});
