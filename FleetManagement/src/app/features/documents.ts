import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MainLayoutComponent } from '../shared/main-layout.component';
import { DocumentService } from '../services/document.service';
import { VehicleService } from '../services/vehicle.service';
import { RoleService } from '../services/role.service';
import { IDocument, DocumentType } from '../models/IDocument';
import { IVehicle } from '../models/IVehicle';

@Component({
  selector: 'app-documents',
  standalone: true,
  imports: [CommonModule, MainLayoutComponent, FormsModule],
  template: `
    <app-main-layout>
      <div class="page-container">
        <header class="page-header">
          <h1>Documents Management</h1>
          <button class="btn-back" (click)="goBack()">Back to Home</button>
        </header>

        <main class="page-content">
          <div class="vehicle-selector">
            <label for="vehicleSelect">Select Vehicle:</label>
            <select
              id="vehicleSelect"
              [(ngModel)]="selectedVehicleId"
              (change)="onVehicleChange()"
              class="vehicle-select"
            >
              <option value="">-- Select a vehicle --</option>
              @for (vehicle of vehicles(); track vehicle.id) {
              <option [value]="vehicle.id">
                {{ vehicle.brand }} {{ vehicle.model }} - {{ vehicle.licensePlate }}
              </option>
              }
            </select>
          </div>

          @if (selectedVehicleId) {
          <div class="stats-row">
            <div class="stat-card">
              <span class="stat-value">{{ documents().length }}</span>
              <span class="stat-label">Total Documents</span>
            </div>
            <div class="stat-card">
              <span class="stat-value">{{ getDocumentsByType(0).length }}</span>
              <span class="stat-label">Insurance</span>
            </div>
            <div class="stat-card">
              <span class="stat-value">{{ getDocumentsByType(1).length }}</span>
              <span class="stat-label">Registration</span>
            </div>
            <div class="stat-card">
              <span class="stat-value">{{ getDocumentsByType(2).length }}</span>
              <span class="stat-label">Maintenance</span>
            </div>
          </div>

          @if (!roleService.isViewer()) {
          <div class="upload-section">
            <div class="upload-box">
              <h3>Upload Document</h3>

              <div class="form-group">
                <label for="documentType">Document Type:</label>
                <select id="documentType" [(ngModel)]="selectedDocumentType" class="form-select">
                  <option [value]="0">Insurance</option>
                  <option [value]="1">Registration</option>
                  <option [value]="2">Maintenance</option>
                  <option [value]="3">Damage Report</option>
                  <option [value]="4">Recepit</option>
                  <option [value]="5">Other</option>
                </select>
              </div>

              <div class="form-group">
                <label for="description">Description (Optional):</label>
                <input
                  type="text"
                  id="description"
                  [(ngModel)]="documentDescription"
                  class="form-input"
                  placeholder="Enter description..."
                />
              </div>

              <div class="file-input-wrapper">
                <input
                  type="file"
                  #fileInput
                  (change)="onFileSelected($event)"
                  class="file-input"
                  id="fileInput"
                />
                <label for="fileInput" class="btn-upload"> Choose File </label>
                @if (selectedFile()) {
                <span class="file-name">{{ selectedFile()!.name }}</span>
                }
              </div>

              @if (uploadError()) {
              <div class="error-message">{{ uploadError() }}</div>
              }

              <button
                class="btn-primary"
                (click)="uploadDocument()"
                [disabled]="!selectedFile() || isUploading()"
              >
                {{ isUploading() ? 'Uploading...' : 'Upload Document' }}
              </button>
            </div>
          </div>
          }

          <div class="documents-section">
            <h2>Documents ({{ documents().length }})</h2>

            @if (isLoading()) {
            <div class="loading">Loading documents...</div>
            } @else if (documents().length === 0) {
            <div class="empty-state">
              <p>No documents uploaded yet</p>
            </div>
            } @else {
            <div class="documents-list">
              @for (doc of documents(); track doc.id) {
              <div class="document-item">
                <div class="doc-icon">
                  <span class="doc-type-badge" [class]="getDocumentTypeClass(doc.documentType)">
                    {{ getDisplayLabel(doc.documentType) }}
                  </span>
                </div>
                <div class="doc-info">
                  <h4>{{ doc.fileName }}</h4>
                  <p class="doc-meta">
                    {{ formatDate(doc.uploadedAt) }} •
                    {{ documentService.formatFileSize(doc.fileSize) }}
                  </p>
                  @if (doc.description) {
                  <p class="doc-description">{{ doc.description }}</p>
                  }
                </div>
                <div class="doc-actions">
                  <button
                    class="btn-icon btn-download"
                    (click)="downloadDocument(doc)"
                    title="Download"
                  >
                    Download
                  </button>
                  @if (!roleService.isViewer()) {
                  <button class="btn-icon btn-delete" (click)="confirmDelete(doc)" title="Delete">
                    Delete
                  </button>
                  }
                </div>
              </div>
              }
            </div>
            }
          </div>
          } @else {
          <div class="empty-state">
            <p>Please select a vehicle to view and manage documents</p>
          </div>
          }
        </main>
      </div>
    </app-main-layout>
  `,
  styles: [
    `
      .page-container {
        min-height: 100vh;
        background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
        padding: 2rem;
      }

      .page-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 2rem;
      }

      .page-header h1 {
        font-size: 2rem;
        color: #2d3748;
        font-weight: 700;
      }

      .btn-back {
        padding: 0.75rem 1.5rem;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        border: none;
        border-radius: 0.5rem;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.3s ease;
        position: sticky;
        top: 2rem;
        z-index: 10;
      }

      .btn-back:hover {
        transform: translateY(-2px);
        box-shadow: 0 5px 15px rgba(102, 126, 234, 0.3);
      }

      .page-content {
        max-width: 1400px;
        margin: 0 auto;
      }

      .vehicle-selector {
        background: white;
        padding: 1.5rem;
        border-radius: 1rem;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        margin-bottom: 2rem;
      }

      .vehicle-selector label {
        display: block;
        font-weight: 600;
        color: #2d3748;
        margin-bottom: 0.5rem;
      }

      .vehicle-select {
        width: 100%;
        padding: 0.75rem;
        border: 2px solid #e2e8f0;
        border-radius: 0.5rem;
        font-size: 1rem;
        color: #2d3748;
        background: white;
        cursor: pointer;
        transition: all 0.2s ease;
      }

      .vehicle-select:hover {
        border-color: #cbd5e0;
      }

      .vehicle-select:focus {
        outline: none;
        border-color: #667eea;
        box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
      }

      .stats-row {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 1.5rem;
        margin-bottom: 2rem;
      }

      .stat-card {
        background: white;
        padding: 1.5rem;
        border-radius: 1rem;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        display: flex;
        flex-direction: column;
        align-items: center;
        transition: all 0.3s ease;
      }

      .stat-card:hover {
        transform: translateY(-2px);
        box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
      }

      .stat-value {
        font-size: 2.5rem;
        font-weight: 700;
        color: #667eea;
        margin-bottom: 0.5rem;
      }

      .stat-label {
        font-size: 0.875rem;
        color: #718096;
        text-align: center;
      }

      .upload-section {
        margin-bottom: 2rem;
      }

      .upload-box {
        background: white;
        border-radius: 1rem;
        padding: 2rem;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      }

      .upload-box h3 {
        font-size: 1.5rem;
        color: #2d3748;
        margin-bottom: 1.5rem;
      }

      .form-group {
        margin-bottom: 1.5rem;
      }

      .form-group label {
        display: block;
        font-size: 0.875rem;
        font-weight: 600;
        color: #2d3748;
        margin-bottom: 0.5rem;
      }

      .form-select,
      .form-input {
        width: 100%;
        padding: 0.75rem;
        border: 2px solid #e2e8f0;
        border-radius: 0.5rem;
        font-size: 1rem;
        color: #2d3748;
        transition: all 0.2s ease;
      }

      .form-select:focus,
      .form-input:focus {
        outline: none;
        border-color: #667eea;
        box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
      }

      .file-input-wrapper {
        display: flex;
        align-items: center;
        gap: 1rem;
        margin-bottom: 1rem;
      }

      .file-input {
        display: none;
      }

      .btn-upload {
        padding: 0.75rem 2rem;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        border: none;
        border-radius: 0.5rem;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.3s ease;
      }

      .btn-upload:hover {
        transform: translateY(-2px);
        box-shadow: 0 5px 15px rgba(102, 126, 234, 0.3);
      }

      .file-name {
        font-size: 0.875rem;
        color: #4a5568;
        flex: 1;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .btn-primary {
        width: 100%;
        padding: 1rem;
        background: linear-gradient(135deg, #48bb78 0%, #38a169 100%);
        color: white;
        border: none;
        border-radius: 0.5rem;
        font-weight: 600;
        font-size: 1rem;
        cursor: pointer;
        transition: all 0.3s ease;
      }

      .btn-primary:hover:not(:disabled) {
        transform: translateY(-2px);
        box-shadow: 0 5px 15px rgba(72, 187, 120, 0.3);
      }

      .btn-primary:disabled {
        opacity: 0.6;
        cursor: not-allowed;
        transform: none;
      }

      .error-message {
        background: #fed7d7;
        color: #742a2a;
        padding: 0.75rem;
        border-radius: 0.5rem;
        margin-bottom: 1rem;
        font-size: 0.875rem;
      }

      .documents-section h2 {
        font-size: 1.5rem;
        color: #2d3748;
        margin-bottom: 1.5rem;
        font-weight: 600;
      }

      .documents-list {
        display: flex;
        flex-direction: column;
        gap: 1rem;
      }

      .document-item {
        background: white;
        border-radius: 0.75rem;
        padding: 1.5rem;
        display: flex;
        align-items: center;
        gap: 1.5rem;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        transition: all 0.3s ease;
      }

      .document-item:hover {
        transform: translateX(5px);
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
      }

      .doc-icon {
        flex-shrink: 0;
      }

      .doc-type-badge {
        padding: 0.5rem 1rem;
        border-radius: 0.5rem;
        font-size: 0.75rem;
        font-weight: 600;
        text-transform: uppercase;
      }

      .doc-type-badge.insurance {
        background: #bee3f8;
        color: #2c5282;
      }

      .doc-type-badge.registration {
        background: #c6f6d5;
        color: #22543d;
      }

      .doc-type-badge.maintenance {
        background: #feebc8;
        color: #7c2d12;
      }

      .doc-type-badge.inspection {
        background: #e9d8fd;
        color: #44337a;
      }

      .doc-type-badge.contract {
        background: #fed7d7;
        color: #742a2a;
      }

      .doc-type-badge.other {
        background: #e2e8f0;
        color: #2d3748;
      }

      .doc-info {
        flex: 1;
        min-width: 0;
      }

      .doc-info h4 {
        font-size: 1.125rem;
        color: #2d3748;
        margin-bottom: 0.25rem;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .doc-meta {
        font-size: 0.875rem;
        color: #718096;
        margin: 0;
      }

      .doc-description {
        font-size: 0.875rem;
        color: #4a5568;
        margin: 0.5rem 0 0 0;
        font-style: italic;
      }

      .doc-actions {
        display: flex;
        gap: 0.5rem;
        flex-shrink: 0;
      }

      .btn-icon {
        padding: 0.5rem 1rem;
        border: none;
        border-radius: 0.375rem;
        font-size: 0.875rem;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.2s ease;
      }

      .btn-download {
        background: #667eea;
        color: white;
      }

      .btn-download:hover {
        background: #5a67d8;
        transform: translateY(-2px);
      }

      .btn-delete {
        background: #fc8181;
        color: white;
      }

      .btn-delete:hover {
        background: #f56565;
        transform: translateY(-2px);
      }

      .loading,
      .empty-state {
        text-align: center;
        padding: 3rem;
        background: white;
        border-radius: 1rem;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      }

      .loading {
        color: #667eea;
        font-weight: 600;
      }

      .empty-state p {
        color: #a0aec0;
        font-size: 1rem;
      }

      @media (max-width: 768px) {
        .page-container {
          padding: 1rem;
        }

        .page-header {
          flex-direction: column;
          gap: 1rem;
          align-items: flex-start;
        }

        .page-header h1 {
          font-size: 1.5rem;
        }

        .upload-box {
          padding: 1.5rem 1rem;
        }

        .document-item {
          flex-wrap: wrap;
        }

        .doc-actions {
          width: 100%;
          justify-content: flex-end;
        }

        .file-input-wrapper {
          flex-direction: column;
          align-items: stretch;
        }

        .btn-upload {
          width: 100%;
        }
      }
    `,
  ],
})
export class DocumentsComponent implements OnInit {
  router = inject(Router);
  private route = inject(ActivatedRoute);
  documentService = inject(DocumentService);
  private vehicleService = inject(VehicleService);
  roleService = inject(RoleService);

  vehicles = signal<IVehicle[]>([]);
  documents = signal<IDocument[]>([]);
  selectedFile = signal<File | null>(null);

  selectedVehicleId: string = '';
  selectedDocumentType: number = 0;
  documentDescription: string = '';

  isLoading = signal(false);
  isUploading = signal(false);
  uploadError = signal<string | null>(null);

  ngOnInit() {
    this.loadVehicles();

    // Controlla se c'è un vehicleId nella query string
    this.route.queryParams.subscribe((params) => {
      if (params['vehicleId']) {
        this.selectedVehicleId = params['vehicleId'];
        // Aspetta che i veicoli siano caricati prima di caricare i documenti
        setTimeout(() => {
          if (this.selectedVehicleId) {
            this.loadDocuments();
          }
        }, 500);
      }
    });
  }

  loadVehicles() {
    this.vehicleService.getListVehicles().subscribe({
      next: (response) => {
        this.vehicles.set(response.items);
      },
      error: (error) => {
        console.error('[DocumentsComponent] Error loading vehicles:', error);
      },
    });
  }

  onVehicleChange() {
    if (this.selectedVehicleId) {
      this.loadDocuments();
    } else {
      this.documents.set([]);
    }
    this.resetUploadForm();
  }

  loadDocuments() {
    this.isLoading.set(true);
    this.documentService.getDocumentsByVehicle(this.selectedVehicleId).subscribe({
      next: (docs) => {
        this.documents.set(docs);
        this.isLoading.set(false);
      },
      error: (error) => {
        console.error('[DocumentsComponent] Error loading documents:', error);
        this.isLoading.set(false);
      },
    });
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile.set(input.files[0]);
      this.uploadError.set(null);
    }
  }

  uploadDocument() {
    const file = this.selectedFile();
    if (!file || !this.selectedVehicleId) {
      return;
    }

    this.isUploading.set(true);
    this.uploadError.set(null);

    this.documentService
      .uploadDocument(
        this.selectedVehicleId,
        file,
        this.selectedDocumentType,
        this.documentDescription || undefined
      )
      .subscribe({
        next: () => {
          this.isUploading.set(false);
          this.loadDocuments();
          this.resetUploadForm();
        },
        error: (error) => {
          console.error('[DocumentsComponent] Upload error:', error);
          this.isUploading.set(false);

          let errorMessage = 'Failed to upload document. ';
          if (error.error?.message) {
            errorMessage += error.error.message;
          } else if (error.statusText) {
            errorMessage += error.statusText;
          } else {
            errorMessage += 'Please try again.';
          }
          this.uploadError.set(errorMessage);
        },
      });
  }

  downloadDocument(document: IDocument) {
    this.documentService
      .downloadDocument(this.selectedVehicleId, document.id, document.fileName)
      .subscribe({
        error: (error) => {
          console.error('[DocumentsComponent] Download error:', error);
          alert('Failed to download document. Please try again.');
        },
      });
  }

  confirmDelete(document: IDocument) {
    if (confirm(`Are you sure you want to delete "${document.fileName}"?`)) {
      this.deleteDocument(document);
    }
  }

  deleteDocument(document: IDocument) {
    this.documentService.deleteDocument(this.selectedVehicleId, document.id).subscribe({
      next: () => {
        this.loadDocuments();
      },
      error: (error) => {
        console.error('[DocumentsComponent] Delete error:', error);
        alert('Failed to delete document. Please try again.');
      },
    });
  }

  resetUploadForm() {
    this.selectedFile.set(null);
    this.selectedDocumentType = 0;
    this.documentDescription = '';
    this.uploadError.set(null);

    const fileInput = document.getElementById('fileInput') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  }

  getDocumentsByType(type: number): IDocument[] {
    return this.documents().filter((doc) => {
      const docType =
        typeof doc.documentType === 'string'
          ? this.documentService.getDocumentTypeValue(doc.documentType)
          : doc.documentType;

      return docType === type;
    });
  }

  getDocumentTypeClass(type: string | number): string {
    const numType =
      typeof type === 'string' ? this.documentService.getDocumentTypeValue(type) : type;

    const classes: { [key: number]: string } = {
      0: 'insurance',
      1: 'registration',
      2: 'maintenance',
      3: 'damagereport',
      4: 'recepit',
      5: 'other',
    };
    return classes[numType] || 'other';
  }

  formatDate(dateString: string): string {
    if (!dateString) {
      return 'N/A';
    }

    const date = new Date(dateString);

    if (isNaN(date.getTime())) {
      console.error('[DocumentsComponent] Invalid date:', dateString);
      return 'Invalid Date';
    }

    return date.toLocaleDateString('it-IT', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  }

  getDisplayLabel(type: string | number): string {
    if (typeof type === 'string') {
      return type;
    }
    return this.documentService.getDocumentTypeLabel(type);
  }

  goBack() {
    this.router.navigate(['/home']);
  }
}
