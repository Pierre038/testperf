import { EdeContext } from './ede-eer.model';

export interface IdentificationContext {
  type: IdentificationType | null;
  images: Image[];
  ede?: EdeContext;
  control?: ControlContext;
}

export enum IdentificationType {
  CNI = `carte nationale d'identité`,
  PPT = 'passeport',
}

export interface Image {
  base64: string;
  file: File;
}

export interface ControlContext {
  id: string;
  duration: number;
  result: string;
}
