import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [],
  template: `
    <div class="min-h-screen bg-gradient-to-br from-slate-50 to-slate-200 p-8">
      <header
        class="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4 md:gap-0 max-w-7xl mx-auto"
      >
        <h1 class="text-3xl font-bold text-gray-800">Reports and Statistics</h1>
        <button
          (click)="goBack()"
          class="px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold rounded-lg 
                 transition-all duration-300 hover:transform hover:-translate-y-1 hover:shadow-lg hover:shadow-indigo-500/30"
        >
          Back to Home
        </button>
      </header>

      <main class="max-w-7xl mx-auto space-y-8">
        <!-- Stats Overview -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div class="bg-white p-6 rounded-2xl shadow-xl">
            <h3 class="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">
              Total Distance
            </h3>
            <p class="text-2xl font-bold text-gray-800 mb-2">125,450 km</p>
            <span
              class="inline-flex px-2 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800"
            >
              +12% vs last month
            </span>
          </div>

          <div class="bg-white p-6 rounded-2xl shadow-xl">
            <h3 class="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">
              Fuel Consumption
            </h3>
            <p class="text-2xl font-bold text-gray-800 mb-2">8,240 L</p>
            <span
              class="inline-flex px-2 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-800"
            >
              -5% vs last month
            </span>
          </div>

          <div class="bg-white p-6 rounded-2xl shadow-xl">
            <h3 class="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">
              Total Costs
            </h3>
            <p class="text-2xl font-bold text-gray-800 mb-2">€15,320</p>
            <span
              class="inline-flex px-2 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800"
            >
              +8% vs last month
            </span>
          </div>

          <div class="bg-white p-6 rounded-2xl shadow-xl">
            <h3 class="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">
              Maintenance
            </h3>
            <p class="text-2xl font-bold text-gray-800 mb-2">€3,450</p>
            <span
              class="inline-flex px-2 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-800"
            >
              -15% vs last month
            </span>
          </div>
        </div>

        <!-- Reports Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div
            class="bg-white p-8 rounded-2xl shadow-xl transition-all duration-300 hover:transform hover:-translate-y-2"
          >
            <div class="mb-6">
              <div
                class="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center mb-4"
              ></div>
              <h3 class="text-xl font-bold text-gray-800 mb-2">Monthly Report</h3>
              <p class="text-gray-600 text-sm">Comprehensive monthly fleet analysis</p>
            </div>
            <button
              class="w-full px-4 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold rounded-lg 
                           transition-all duration-300 hover:from-blue-600 hover:to-indigo-700 hover:transform hover:-translate-y-1 hover:shadow-lg"
            >
              Download PDF
            </button>
          </div>

          <div
            class="bg-white p-8 rounded-2xl shadow-xl transition-all duration-300 hover:transform hover:-translate-y-2"
          >
            <div class="mb-6">
              <div
                class="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl flex items-center justify-center mb-4"
              ></div>
              <h3 class="text-xl font-bold text-gray-800 mb-2">Trip History</h3>
              <p class="text-gray-600 text-sm">Detailed trip logs and routes</p>
            </div>
            <button
              class="w-full px-4 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold rounded-lg 
                           transition-all duration-300 hover:from-green-600 hover:to-emerald-700 hover:transform hover:-translate-y-1 hover:shadow-lg"
            >
              Download PDF
            </button>
          </div>

          <div
            class="bg-white p-8 rounded-2xl shadow-xl transition-all duration-300 hover:transform hover:-translate-y-2"
          >
            <div class="mb-6">
              <div
                class="w-12 h-12 bg-gradient-to-r from-yellow-500 to-orange-600 rounded-xl flex items-center justify-center mb-4"
              ></div>
              <h3 class="text-xl font-bold text-gray-800 mb-2">Maintenance Log</h3>
              <p class="text-gray-600 text-sm">All maintenance activities</p>
            </div>
            <button
              class="w-full px-4 py-3 bg-gradient-to-r from-yellow-500 to-orange-600 text-white font-semibold rounded-lg 
                           transition-all duration-300 hover:from-yellow-600 hover:to-orange-700 hover:transform hover:-translate-y-1 hover:shadow-lg"
            >
              Download PDF
            </button>
          </div>

          <div
            class="bg-white p-8 rounded-2xl shadow-xl transition-all duration-300 hover:transform hover:-translate-y-2"
          >
            <div class="mb-6">
              <div
                class="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl flex items-center justify-center mb-4"
              ></div>
              <h3 class="text-xl font-bold text-gray-800 mb-2">Cost Analysis</h3>
              <p class="text-gray-600 text-sm">Expense breakdown and trends</p>
            </div>
            <button
              class="w-full px-4 py-3 bg-gradient-to-r from-purple-500 to-pink-600 text-white font-semibold rounded-lg 
                           transition-all duration-300 hover:from-purple-600 hover:to-pink-700 hover:transform hover:-translate-y-1 hover:shadow-lg"
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
