import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-vehicles',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="min-h-screen bg-gradient-to-br from-slate-50 to-slate-200 p-8">
      <header
        class="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4 md:gap-0 max-w-7xl mx-auto"
      >
        <h1 class="text-3xl font-bold text-gray-800">Vehicles Management</h1>
        <button
          (click)="goBack()"
          class="px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold rounded-lg 
                 transition-all duration-300 hover:transform hover:-translate-y-1 hover:shadow-lg hover:shadow-indigo-500/30"
        >
          Back to Home
        </button>
      </header>

      <main class="max-w-7xl mx-auto">
        <!-- Stats Cards -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div
            class="bg-white p-6 rounded-2xl shadow-xl text-center hover:transform hover:-translate-y-2 transition-all duration-300"
          >
            <div class="text-3xl font-bold text-indigo-600 mb-2">24</div>
            <div class="text-sm font-semibold text-gray-500 uppercase tracking-wide">
              Total Vehicles
            </div>
          </div>
          <div
            class="bg-white p-6 rounded-2xl shadow-xl text-center hover:transform hover:-translate-y-2 transition-all duration-300"
          >
            <div class="text-3xl font-bold text-green-600 mb-2">18</div>
            <div class="text-sm font-semibold text-gray-500 uppercase tracking-wide">Active</div>
          </div>
          <div
            class="bg-white p-6 rounded-2xl shadow-xl text-center hover:transform hover:-translate-y-2 transition-all duration-300"
          >
            <div class="text-3xl font-bold text-yellow-600 mb-2">4</div>
            <div class="text-sm font-semibold text-gray-500 uppercase tracking-wide">
              Maintenance
            </div>
          </div>
          <div
            class="bg-white p-6 rounded-2xl shadow-xl text-center hover:transform hover:-translate-y-2 transition-all duration-300"
          >
            <div class="text-3xl font-bold text-blue-600 mb-2">2</div>
            <div class="text-sm font-semibold text-gray-500 uppercase tracking-wide">Available</div>
          </div>
        </div>

        <!-- Main Content -->
        <div class="bg-white rounded-2xl p-8 shadow-xl">
          <div class="mb-6">
            <h2 class="text-2xl font-bold text-gray-800 mb-2">Vehicle List</h2>
            <p class="text-gray-600">Manage and monitor your fleet vehicles</p>
          </div>

          <div
            class="text-center py-16 bg-gray-50 rounded-xl border-2 border-dashed border-gray-300"
          >
            <div class="max-w-md mx-auto">
              <svg
                class="mx-auto h-16 w-16 text-gray-400 mb-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M8 16l2.5-3.5L13 16l5-7 3 4H8z"
                />
              </svg>
              <h3 class="text-lg font-medium text-gray-900 mb-2">Vehicle Management Interface</h3>
              <p class="text-gray-500">
                The vehicle management interface will be implemented here with full CRUD operations,
                filtering, and real-time updates.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  `,
  styles: [],
})
export class VehiclesComponent {
  constructor(private router: Router) {}

  goBack() {
    this.router.navigate(['/home']);
  }
}
