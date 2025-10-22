import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-documents',
  standalone: true,
  imports: [],
  template: `
    <div class="min-h-screen bg-gradient-to-br from-slate-50 to-slate-300 p-8">
      <header class="flex justify-between items-center mb-8">
        <h1 class="text-3xl text-gray-800 font-bold">Documents Management</h1>
        <button
          (click)="goBack()"
          class="px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-lg font-semibold 
                 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-indigo-500/30"
        >
          Back to Home
        </button>
      </header>

      <main class="max-w-7xl mx-auto">
        <!-- Stats Row -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div class="bg-white p-6 rounded-2xl shadow-lg flex flex-col items-center">
            <span class="text-sm text-gray-500 text-center">Total Documents</span>
            <span class="text-4xl font-bold text-indigo-600 mt-2">156</span>
          </div>
          <div class="bg-white p-6 rounded-2xl shadow-lg flex flex-col items-center">
            <span class="text-sm text-gray-500 text-center">Insurance</span>
            <span class="text-4xl font-bold text-green-600 mt-2">45</span>
          </div>
          <div class="bg-white p-6 rounded-2xl shadow-lg flex flex-col items-center">
            <span class="text-sm text-gray-500 text-center">Registration</span>
            <span class="text-4xl font-bold text-blue-600 mt-2">38</span>
          </div>
          <div class="bg-white p-6 rounded-2xl shadow-lg flex flex-col items-center">
            <span class="text-sm text-gray-500 text-center">Others</span>
            <span class="text-4xl font-bold text-purple-600 mt-2">73</span>
          </div>
        </div>

        <!-- Content Card -->
        <div class="bg-white p-8 rounded-2xl shadow-lg">
          <h2 class="text-2xl text-gray-800 font-semibold mb-2">Document Repository</h2>
          <p class="text-gray-500 mb-8">Manage vehicle documentation and certificates</p>
          <div
            class="text-center p-12 bg-slate-50 rounded-lg border-2 border-dashed border-slate-300"
          >
            <p class="text-gray-400 text-base">
              Document management interface will be implemented here
            </p>
            <p class="text-gray-400 text-sm mt-4">Upload, view, and organize documents</p>
          </div>
        </div>
      </main>
    </div>
  `,
  styles: [],
})
export class DocumentsComponent {
  private router = inject(Router);

  goBack() {
    this.router.navigate(['/home']);
  }
}
