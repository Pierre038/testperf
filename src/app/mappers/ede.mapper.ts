import { Injectable } from '@angular/core';
import { EdeBapi } from '../models/ede-bapi.model';
import { EdeContext } from '../models/ede-eer.model';
import { Mapper } from './mapper';

@Injectable()
export class EdeMapper implements Mapper<EdeBapi, EdeContext> {
  public toDomainModel(edeContext: EdeContext): EdeBapi {
    return {
      characteristics: {
        applicationId: 'EERD',
        userApplicationId: edeContext.userId,
        filename: edeContext.fileName,
        depositCode: 1,
        retentionEndDate: '',
        hashcode: edeContext.fileHashCode,
        token: edeContext.token,
        uploadLinks: {
          _links: {
            self: {
              href: edeContext.fileUrl,
            },
            download: null,
          },
        },
      },
      response: {
        interactionId: '',
        code: '',
        label: '',
      },
    };
  }

  public toAppModel(edeBapi: EdeBapi): EdeContext {
    return {
      userId: edeBapi.characteristics.userApplicationId,
      token: edeBapi.characteristics.token,
      fileName: edeBapi.characteristics.filename,
      fileUrl: edeBapi.characteristics.uploadLinks._links.self.href,
      fileHashCode: edeBapi.characteristics.hashcode,
    };
  }
}
