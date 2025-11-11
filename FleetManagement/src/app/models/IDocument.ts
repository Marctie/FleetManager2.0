export interface IDocument {
  id: string;
  fileName: string;
  fileType: string;
  uploadedAt: string; // Changed from uploadDate to match API response
  vehicleId: string;
  documentType: string | number; // API returns string ("Insurance"), we send number (0)
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
