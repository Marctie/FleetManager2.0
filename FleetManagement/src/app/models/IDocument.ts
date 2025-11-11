export interface IDocument {
  id: string;
  fileName: string;
  fileType: string;
  uploadDate: string;
  vehicleId: string;
  documentType: number;
  fileSize: number;
  description?: string;
}

export interface IDocumentUploadRequest {
  file: File;
  documentType: number;
  description?: string;
}

export enum DocumentType {
  Insurance = 0,
  Registration = 1,
  Maintenance = 2,
  Inspection = 3,
  Contract = 4,
  Other = 5,
}
