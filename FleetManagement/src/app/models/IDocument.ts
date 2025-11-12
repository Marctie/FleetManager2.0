export interface IDocument {
  id: string;
  fileName: string;
  fileType: string;
  uploadedAt: string; 
  vehicleId: string;
  documentType: string | number;
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
