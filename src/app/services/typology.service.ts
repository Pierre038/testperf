import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { FamilySituationMapper } from '../mappers/typology.mapper';
import { EerCommonParams } from '../models/eer-common-config.model';
import { FamilySituationBapi } from '../models/typology-bapi.model';
import { FamilySituation } from '../models/typology-eer.model';
import { EER_COMMON_PARAMS_TOKEN } from '../tokens/tokens';

@Injectable()
export class TypologyService {
  private readonly typoURL: string;

  constructor(
    private readonly http: HttpClient,
    @Inject(EER_COMMON_PARAMS_TOKEN) private readonly EerConfig: EerCommonParams,
    private readonly typoMapper: FamilySituationMapper,
  ) {
    this.typoURL = this.EerConfig.urls.Typology;
  }

  public getMaritalSituations(): Observable<FamilySituation[]> {
    // return this.http
    //   .get<FamilySituationBapi[]>(encodeURI(`${this.typoURL}/familySituation`))
    //   .pipe(map((bapiFamilySituations) => this.typoMapper.toAppModelCollection(bapiFamilySituations)));
    return of([
      { code: '1', label: 'célibataire' },
      { code: '2', label: 'marié(e)' },
    ]);
  }
}
