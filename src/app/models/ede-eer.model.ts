export interface EdeContext {
  userId: string;
  token: string;
  file?: Blob;
  fileName: string;
  fileUrl: string;
  fileHashCode: string;
}
