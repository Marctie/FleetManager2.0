import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-vehicle-detail',
  standalone: true,
  imports: [],
  template: `
    <div class="min-h-screen bg-gradient-to-br from-slate-50 to-slate-200 p-8">
      <header class="flex justify-between items-center mb-8 max-w-4xl mx-auto">
        <h1 class="text-3xl font-bold text-gray-800">Vehicle Details</h1>
        <button
          (click)="goBack()"
          class="px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold rounded-lg 
                 transition-all duration-300 hover:transform hover:-translate-y-1 hover:shadow-lg hover:shadow-indigo-500/30"
        >
          Back to Home
        </button>
      </header>

      <main class="max-w-4xl mx-auto">
        <div class="bg-white rounded-2xl p-8 shadow-xl">
          <!-- Vehicle Header -->
          <div class="flex items-center gap-6 mb-8 pb-6 border-b-2 border-gray-100">
            <div>
              <h2 class="text-2xl font-bold text-gray-800 mb-2">Ford Transit</h2>
              <p class="text-sm text-gray-500">ID: V001 | Plate: AB123CD</p>
            </div>
          </div>

          <!-- Detail Grid -->
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div class="space-y-2">
              <label class="block text-sm font-semibold text-gray-500 uppercase tracking-wide"
                >Model</label
              >
              <p class="text-lg text-gray-800 font-medium">Ford Transit</p>
            </div>
            <div class="space-y-2">
              <label class="block text-sm font-semibold text-gray-500 uppercase tracking-wide"
                >Year</label
              >
              <p class="text-lg text-gray-800 font-medium">2022</p>
            </div>
            <div class="space-y-2">
              <label class="block text-sm font-semibold text-gray-500 uppercase tracking-wide"
                >Status</label
              >
              <span
                class="inline-flex px-3 py-1 rounded-full text-sm font-semibold bg-green-100 text-green-800"
              >
                Active
              </span>
            </div>
            <div class="space-y-2">
              <label class="block text-sm font-semibold text-gray-500 uppercase tracking-wide"
                >Driver</label
              >
              <p class="text-lg text-gray-800 font-medium">John Doe</p>
            </div>
            <div class="space-y-2">
              <label class="block text-sm font-semibold text-gray-500 uppercase tracking-wide"
                >Mileage</label
              >
              <p class="text-lg text-gray-800 font-medium">45,230 km</p>
            </div>
            <div class="space-y-2">
              <label class="block text-sm font-semibold text-gray-500 uppercase tracking-wide"
                >Fuel Type</label
              >
              <p class="text-lg text-gray-800 font-medium">Diesel</p>
            </div>
            <div class="space-y-2">
              <label class="block text-sm font-semibold text-gray-500 uppercase tracking-wide"
                >Last Service</label
              >
              <p class="text-lg text-gray-800 font-medium">15/09/2025</p>
            </div>
            <div class="space-y-2">
              <label class="block text-sm font-semibold text-gray-500 uppercase tracking-wide"
                >Next Service</label
              >
              <p class="text-lg text-gray-800 font-medium">15/12/2025</p>
            </div>
          </div>

          <!-- Actions -->
          <div class="flex flex-col sm:flex-row gap-4 pt-6 border-t-2 border-gray-100">
            <button
              class="px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg 
                           transition-all duration-300 hover:bg-indigo-700 hover:transform hover:-translate-y-1 hover:shadow-lg"
            >
              Edit Vehicle
            </button>
            <button
              class="px-6 py-3 bg-gray-200 text-gray-800 font-semibold rounded-lg 
                           transition-all duration-300 hover:bg-gray-300 hover:transform hover:-translate-y-1 hover:shadow-lg"
            >
              View History
            </button>
            <button
              class="px-6 py-3 bg-red-500 text-white font-semibold rounded-lg 
                           transition-all duration-300 hover:bg-red-600 hover:transform hover:-translate-y-1 hover:shadow-lg"
            >
              Delete
            </button>
          </div>
        </div>
      </main>
    </div>
  `,
  styles: [],
})
export class VehicleDetailComponent {
  private router = inject(Router);

  goBack() {
    this.router.navigate(['/home']);
  }
}
