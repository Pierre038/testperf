import jsPDF from 'jspdf';
import { EdeContext } from '../../models/ede-eer.model';
import { IdentificationType, Image } from '../../models/identification.model';

const Actions = {
  EDIT_IDENTIFICATION_TYPE: '[ID TYPE SELECTION] Edit the identification type',
  EDIT_IMAGES: '[IMAGES SUPPRESSION] Edit the image collection',
  ADD_IMAGE: '[IMAGE API] add an image in the context',
  ADD_IMAGE_SUCCESS: '[IMAGE API] add an image in the context success',
  ADD_IMAGE_FAILED: '[IMAGE API] add an image in the context failed',
  IMAGE_PROCESSING: '[IMAGE API] image processing',
  IMAGE_PROCESSING_SUCCESS: '[IMAGE API] image processing success',
  IMAGE_PROCESSING_FAILED: '[IMAGE API] image processing failed',
  SET_PDF: '[IMAGE API] setting pdf to upload',
  SET_PDF_SUCCESS: '[IMAGE API] setting pdf success',
  SET_PDF_FAILED: '[IMAGE API] setting pdf failed',
  GET_TOKEN: '[UPLOAD API] get uploading transaction token',
  GET_TOKEN_SUCCESS: '[UPLOAD API] get uploading transaction token success',
  GET_TOKEN_FAILED: '[UPLOAD API] get uploading transaction token failed',
  UPLOAD: '[UPLOAD API] uploading file',
  UPLOAD_SUCCESS: '[UPLOAD API] uploading file success',
  UPLOAD_FAILED: '[UPLOAD API] uploading file failed',
};

export class EditType {
  public static readonly type = Actions.EDIT_IDENTIFICATION_TYPE;
  constructor(public readonly identificationType: IdentificationType) {}
}

export class EditImages {
  public static readonly type = Actions.EDIT_IMAGES;
  constructor(public readonly images: Image[]) {}
}

export class AddImage {
  public static readonly type = Actions.ADD_IMAGE;
  constructor(public readonly file: File) {}
}
export class AddImageSuccess {
  public static readonly type = Actions.ADD_IMAGE_SUCCESS;
  constructor(public readonly image: Image) {}
}

export class AddImageFailed {
  public static readonly type = Actions.ADD_IMAGE_FAILED;
  constructor(public readonly error: Error) {}
}

export class ImageProcessing {
  public static readonly type = Actions.IMAGE_PROCESSING;
  constructor(public readonly images: Image[], public readonly force: boolean) {}
}

export class ImageProcessingSuccess {
  public static readonly type = Actions.IMAGE_PROCESSING_SUCCESS;
  constructor(public readonly images: Image[]) {}
}

export class ImageProcessingFailed {
  public static readonly type = Actions.IMAGE_PROCESSING_FAILED;
  constructor(public readonly error: Error) {}
}

export class SetPdf {
  public static readonly type = Actions.SET_PDF;
  constructor(public readonly images: Image[]) {}
}

export class SetPdfSuccess {
  public static readonly type = Actions.SET_PDF_SUCCESS;
  constructor(public readonly pdf: jsPDF) {}
}

export class SetPdfFailed {
  public static readonly type = Actions.SET_PDF_FAILED;
  constructor(public readonly error: Error) {}
}

export class GetToken {
  public static readonly type = Actions.GET_TOKEN;
  constructor(public readonly context: EdeContext) {}
}

export class GetTokenSuccess {
  public static readonly type = Actions.GET_TOKEN_SUCCESS;
  constructor(public readonly context: EdeContext) {}
}

export class GetTokenFailed {
  public static readonly type = Actions.GET_TOKEN_FAILED;
  constructor(public readonly error: Error) {}
}

export class Upload {
  public static readonly type = Actions.UPLOAD;
  constructor(public readonly context: EdeContext) {}
}

export class UploadSuccess {
  public static readonly type = Actions.UPLOAD_SUCCESS;
  constructor(public readonly context: EdeContext) {}
}

export class UploadFailed {
  public static readonly type = Actions.UPLOAD_FAILED;
  constructor(public readonly error: Error) {}
}
