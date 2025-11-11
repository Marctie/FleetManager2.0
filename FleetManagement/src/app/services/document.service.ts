import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { IDocument } from '../models/IDocument';
import { ConfigService } from './config.service';

@Injectable({
  providedIn: 'root',
})
export class DocumentService {
  private http = inject(HttpClient);
  private configService = inject(ConfigService);

  private getDocumentEndpoints(vehicleId: string) {
    const baseUrl = this.configService.getApiBaseUrl();
    return {
      list: `${baseUrl}/api/vehicles/${vehicleId}/Documents`,
      upload: `${baseUrl}/api/vehicles/${vehicleId}/Documents`,
      getById: (docId: string) => `${baseUrl}/api/vehicles/${vehicleId}/Documents/${docId}`,
      delete: (docId: string) => `${baseUrl}/api/vehicles/${vehicleId}/Documents/${docId}`,
    };
  }

  getDocumentsByVehicle(vehicleId: string): Observable<IDocument[]> {
    const endpoints = this.getDocumentEndpoints(vehicleId);
    return this.http.get<IDocument[]>(endpoints.list).pipe(
      catchError((error) => {
        console.error('[DocumentService] Error fetching documents:', error);
        throw error;
      })
    );
  }

  uploadDocument(
    vehicleId: string,
    file: File,
    documentType: number,
    description?: string
  ): Observable<IDocument> {
    const endpoints = this.getDocumentEndpoints(vehicleId);
    const formData = new FormData();

    formData.append('file', file);
    formData.append('documentType', documentType.toString());
    if (description) {
      formData.append('description', description);
    }

    return this.http.post<IDocument>(endpoints.upload, formData).pipe(
      catchError((error) => {
        console.error('[DocumentService] Error uploading document:', error);
        throw error;
      })
    );
  }

  downloadDocument(vehicleId: string, documentId: string, fileName: string): Observable<Blob> {
    const endpoints = this.getDocumentEndpoints(vehicleId);
    return this.http
      .get(endpoints.getById(documentId), {
        responseType: 'blob',
      })
      .pipe(
        tap((blob) => {
          const url = window.URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = fileName;
          link.click();
          window.URL.revokeObjectURL(url);
        }),
        catchError((error) => {
          console.error('[DocumentService] Error downloading document:', error);
          throw error;
        })
      );
  }

  deleteDocument(vehicleId: string, documentId: string): Observable<void> {
    const endpoints = this.getDocumentEndpoints(vehicleId);
    return this.http.delete<void>(endpoints.delete(documentId)).pipe(
      catchError((error) => {
        console.error('[DocumentService] Error deleting document:', error);
        throw error;
      })
    );
  }

  getDocumentTypeLabel(type: number): string {
    const labels: { [key: number]: string } = {
      0: 'Insurance',
      1: 'Registration',
      2: 'Maintenance',
      3: 'Inspection',
      4: 'Contract',
      5: 'Other',
    };
    return labels[type] || 'Unknown';
  }

  getDocumentTypeValue(label: string): number {
    const values: { [key: string]: number } = {
      Insurance: 0,
      Registration: 1,
      Maintenance: 2,
      DamageReport: 3,
      Recepit: 4,
      Other: 5,
    };
    return values[label] ?? -1;
  }

  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
  }
}
