import { EerCommonParams } from '../models/eer-common-config.model';

export const EER_COMMON_CONFIG_DATA: Partial<EerCommonParams> = {
  urls: {
    DQM: 'Url_Dqm',
    Typology: 'Url_Typology/',
    User: 'Url_User/',
    EDE: {
      initUpload: 'Url_ede_initUpload/',
      upload: 'Url_ede_upload/',
    },
  },
};
