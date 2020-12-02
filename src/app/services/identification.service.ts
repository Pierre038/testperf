import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { EdeMapper } from '../mappers/ede.mapper';
import { EdeBapi, Links } from '../models/ede-bapi.model';
import { EdeContext } from '../models/ede-eer.model';
import { EER_COMMON_PARAMS_TOKEN } from '../tokens/tokens';

@Injectable()
export class IdentificationService {
  constructor(
    private readonly http: HttpClient,
    private readonly edeMapper: EdeMapper,
  ) {}

  public initUploadId(edeContext: EdeContext): Observable<EdeContext> {
    const edeBapi = this.edeMapper.toDomainModel(edeContext);
    // return this.http
    //   .post<EdeBapi>(this.config.urls.EDE.initUpload, edeBapi)
    //   .pipe(map((response: EdeBapi) => this.edeMapper.toAppModel(response)));
    return of(edeContext);
  }

  public uploadId(edeContext: EdeContext): Observable<EdeContext> {
    // return this.http.post(uploadUrl, {}).pipe(
    //   map((response: Links) => {
    //     const fileUrl = response._links.self.href;
    //     return { ...edeContext, fileUrl };
    //   }),
    // );
    return of(edeContext);
  }

  public initControlId(idUrl: string): void {
    throw new Error('Method not implemented.');
  }

  public controlId(): void {
    throw new Error('Method not implemented.');
  }
}
