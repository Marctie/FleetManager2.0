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
              >
                <svg
                  class="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
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
              >
                <svg
                  class="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              </div>
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
              >
                <svg
                  class="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                  />
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              </div>
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
              >
                <svg
                  class="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                  />
                </svg>
              </div>
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
