import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [],
  template: `
    <div class="min-h-screen bg-gradient-to-br from-slate-50 to-slate-300 p-8">
      <header class="flex justify-between items-center mb-8">
        <h1 class="text-3xl text-gray-800 font-bold">Reports and Statistics</h1>
        <button
          (click)="goBack()"
          class="px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-lg font-semibold 
                 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-indigo-500/30"
        >
          Back to Home
        </button>
      </header>

      <main class="max-w-7xl mx-auto">
        <!-- Stats Overview -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div class="bg-white p-6 rounded-2xl shadow-lg">
            <h3 class="text-sm text-gray-500 mb-2">Total Distance</h3>
            <p class="text-3xl font-bold text-indigo-600 mb-2">125,450 km</p>
            <span
              class="inline-block px-3 py-1 text-xs font-semibold rounded-md bg-green-100 text-green-800"
            >
              +12% vs last month
            </span>
          </div>
          <div class="bg-white p-6 rounded-2xl shadow-lg">
            <h3 class="text-sm text-gray-500 mb-2">Fuel Consumption</h3>
            <p class="text-3xl font-bold text-indigo-600 mb-2">8,240 L</p>
            <span
              class="inline-block px-3 py-1 text-xs font-semibold rounded-md bg-red-100 text-red-800"
            >
              -5% vs last month
            </span>
          </div>
          <div class="bg-white p-6 rounded-2xl shadow-lg">
            <h3 class="text-sm text-gray-500 mb-2">Total Costs</h3>
            <p class="text-3xl font-bold text-indigo-600 mb-2">€15,320</p>
            <span
              class="inline-block px-3 py-1 text-xs font-semibold rounded-md bg-green-100 text-green-800"
            >
              +8% vs last month
            </span>
          </div>
          <div class="bg-white p-6 rounded-2xl shadow-lg">
            <h3 class="text-sm text-gray-500 mb-2">Maintenance</h3>
            <p class="text-3xl font-bold text-indigo-600 mb-2">€3,450</p>
            <span
              class="inline-block px-3 py-1 text-xs font-semibold rounded-md bg-red-100 text-red-800"
            >
              -15% vs last month
            </span>
          </div>
        </div>

        <!-- Reports Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div
            class="bg-white p-8 rounded-2xl shadow-lg transition-transform duration-300 hover:-translate-y-2"
          >
            <h3 class="text-xl text-gray-800 mb-3">Monthly Report</h3>
            <p class="text-gray-500 mb-6 text-sm">Comprehensive monthly fleet analysis</p>
            <button
              class="w-full px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-lg 
                           font-semibold transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg"
            >
              Download PDF
            </button>
          </div>
          <div
            class="bg-white p-8 rounded-2xl shadow-lg transition-transform duration-300 hover:-translate-y-2"
          >
            <h3 class="text-xl text-gray-800 mb-3">Trip History</h3>
            <p class="text-gray-500 mb-6 text-sm">Detailed trip logs and routes</p>
            <button
              class="w-full px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-lg 
                           font-semibold transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg"
            >
              Download PDF
            </button>
          </div>
          <div
            class="bg-white p-8 rounded-2xl shadow-lg transition-transform duration-300 hover:-translate-y-2"
          >
            <h3 class="text-xl text-gray-800 mb-3">Maintenance Log</h3>
            <p class="text-gray-500 mb-6 text-sm">All maintenance activities</p>
            <button
              class="w-full px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-lg 
                           font-semibold transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg"
            >
              Download PDF
            </button>
          </div>
          <div
            class="bg-white p-8 rounded-2xl shadow-lg transition-transform duration-300 hover:-translate-y-2"
          >
            <h3 class="text-xl text-gray-800 mb-3">Cost Analysis</h3>
            <p class="text-gray-500 mb-6 text-sm">Expense breakdown and trends</p>
            <button
              class="w-full px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-lg 
                           font-semibold transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg"
            >
              Download PDF
            </button>
          </div>
        </div>
      </main>
    </div>
  `,
  styles: [],
})
export class ReportsComponent {
  private router = inject(Router);

  goBack() {
    this.router.navigate(['/home']);
  }
}
