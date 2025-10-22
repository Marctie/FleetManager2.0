import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-documents',
  standalone: true,
  imports: [],
  template: `
    <div class="min-h-screen bg-gradient-to-br from-slate-50 to-slate-200 p-8">
      <header
        class="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4 md:gap-0 max-w-6xl mx-auto"
      >
        <h1 class="text-3xl font-bold text-gray-800">Document Management</h1>
        <button
          (click)="goBack()"
          class="px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold rounded-lg 
                 transition-all duration-300 hover:transform hover:-translate-y-1 hover:shadow-lg hover:shadow-indigo-500/30"
        >
          Back to Home
        </button>
      </header>

      <main class="max-w-6xl mx-auto space-y-8">
        <!-- Upload Section -->
        <div
          class="bg-white rounded-2xl p-8 shadow-xl border-2 border-dashed border-gray-200 hover:border-indigo-400 transition-all duration-300 hover:bg-gray-50"
        >
          <div class="text-center">
            <div
              class="mx-auto w-16 h-16 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center mb-6"
            ></div>
            <h3 class="text-2xl font-bold text-gray-800 mb-2">Upload Document</h3>
            <p class="text-gray-600 mb-6">Drag and drop files here or click to browse</p>
            <button
              class="px-8 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold rounded-lg 
                           transition-all duration-300 hover:from-indigo-600 hover:to-purple-700 hover:transform hover:-translate-y-1 hover:shadow-lg"
            >
              Choose File
            </button>
          </div>
        </div>

        <!-- Documents Section -->
        <div class="bg-white rounded-2xl p-8 shadow-xl">
          <h2 class="text-2xl font-bold text-gray-800 mb-6">Recent Documents</h2>
          <div class="space-y-4">
            @for (doc of documents; track doc.name) {
            <div
              class="flex items-center p-4 border border-gray-200 rounded-xl hover:shadow-lg transition-all duration-300 hover:transform hover:translate-x-2"
            >
              <div
                class="flex-shrink-0 w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center mr-4"
              ></div>

              <div class="flex-1 min-w-0">
                <h4 class="text-lg font-semibold text-gray-800 truncate">{{ doc.name }}</h4>
                <p class="text-sm text-gray-500">{{ doc.vehicle }} • {{ doc.date }}</p>
              </div>

              <div class="flex space-x-2 ml-4">
                <button
                  class="px-3 py-2 bg-green-500 text-white text-sm font-medium rounded-lg hover:bg-green-600 transition-colors"
                  title="Download"
                >
                  Download
                </button>
                <button
                  class="px-3 py-2 bg-blue-500 text-white text-sm font-medium rounded-lg hover:bg-blue-600 transition-colors"
                  title="View"
                >
                  View
                </button>
                <button
                  class="px-3 py-2 bg-red-500 text-white text-sm font-medium rounded-lg hover:bg-red-600 transition-colors"
                  title="Delete"
                >
                  Delete
                </button>
              </div>
            </div>
            }
          </div>
        </div>
      </main>
    </div>
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
  private router = inject(Router);

  documents = [
    {
      name: 'Insurance Certificate',
      vehicle: 'V001 - Ford Transit',
      date: '10/10/2025',
    },
    {
      name: 'Registration Document',
      vehicle: 'V002 - Mercedes Sprinter',
      date: '08/10/2025',
    },
    {
      name: 'Maintenance Report',
      vehicle: 'V003 - Fiat Ducato',
      date: '05/10/2025',
    },
    {
      name: 'Inspection Certificate',
      vehicle: 'V004 - VW Crafter',
      date: '01/10/2025',
    },
    {
      name: 'Tax Document',
      vehicle: 'V005 - Renault Master',
      date: '28/09/2025',
    },
  ];

  goBack() {
    this.router.navigate(['/home']);
  }
}
