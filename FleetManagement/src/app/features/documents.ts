import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MainLayoutComponent } from '../shared/main-layout.component';

@Component({
  selector: 'app-documents',
  standalone: true,
  imports: [CommonModule, MainLayoutComponent],
  template: `
    <app-main-layout>
      <div class="page-container">
        <header class="page-header">
          <h1>Document Management</h1>
          <button class="btn-back" (click)="goBack()">Back to Home</button>
        </header>

        <main class="page-content">
          <div class="upload-section">
            <div class="upload-box">
              <h3>Upload Document</h3>
              <p>Drag and drop files here or click to browse</p>
              <button class="btn-upload">Choose File</button>
            </div>
          </div>

          <div class="documents-section">
            <h2>Recent Documents</h2>
            <div class="documents-list">
              <div class="document-item" *ngFor="let doc of documents">
                <div class="doc-info">
                  <h4>{{ doc.name }}</h4>
                  <p>{{ doc.vehicle }} • {{ doc.date }}</p>
                </div>
                <div class="doc-actions">
                  <button class="btn-icon" title="Download">Download</button>
                  <button class="btn-icon" title="View">View</button>
                  <button class="btn-icon" title="Delete">Delete</button>
                </div>
              </div>
            </div>
          </div>
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
      }

      .btn-back:hover {
        transform: translateY(-2px);
        box-shadow: 0 5px 15px rgba(102, 126, 234, 0.3);
      }

      .page-content {
        max-width: 1200px;
        margin: 0 auto;
      }

      .upload-section {
        margin-bottom: 2rem;
      }

      .upload-box {
        background: white;
        border: 2px dashed #cbd5e0;
        border-radius: 1rem;
        padding: 3rem;
        text-align: center;
        transition: all 0.3s ease;
      }

      .upload-box:hover {
        border-color: #667eea;
        background: #f7fafc;
      }

      .upload-box h3 {
        font-size: 1.5rem;
        color: #2d3748;
        margin-bottom: 0.5rem;
      }

      .upload-box p {
        color: #718096;
        margin-bottom: 1.5rem;
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

      .documents-section h2 {
        font-size: 1.5rem;
        color: #2d3748;
        margin-bottom: 1.5rem;
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
        gap: 1rem;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        transition: all 0.3s ease;
      }

      .document-item:hover {
        transform: translateX(5px);
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
      }

      .doc-info {
        flex: 1;
      }

      .doc-info h4 {
        font-size: 1.125rem;
        color: #2d3748;
        margin-bottom: 0.25rem;
      }

      .doc-info p {
        font-size: 0.875rem;
        color: #718096;
        margin: 0;
      }

      .doc-actions {
        display: flex;
        gap: 0.5rem;
      }

      .btn-icon {
        background: #667eea;
        color: white;
        border: none;
        border-radius: 0.25rem;
        font-size: 0.875rem;
        cursor: pointer;
        padding: 0.5rem 1rem;
        transition: all 0.2s ease;
      }

      .btn-icon:hover {
        background: #5a67d8;
        transform: translateY(-2px);
      }

      @media (max-width: 768px) {
        .upload-box {
          padding: 2rem 1rem;
        }

        .document-item {
          flex-wrap: wrap;
        }

        .doc-actions {
          width: 100%;
          justify-content: flex-end;
        }
      }
    `,
  ],
})
export class DocumentsComponent {
  documents = [
    {
      name: 'Insurance Certificate',
      vehicle: 'V001 - Ford Transit',
      date: '10/10/2025',
    },
  ];

  constructor(private router: Router) {}

  goBack() {
    this.router.navigate(['/home']);
  }
}
