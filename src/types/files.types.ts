export interface FileUploadResult {
  key: string;
  url: string;
}

export interface Files {
  uploadFile(file: Express.Multer.File | Buffer, folder?: string, tags?: Record<string, string>): Promise<FileUploadResult>;
  deleteFile(key: string): Promise<boolean>;
}
