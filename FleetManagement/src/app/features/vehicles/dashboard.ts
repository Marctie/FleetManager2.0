import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { PageHeaderComponent } from '../../shared/page-header.component';
import { StatCardComponent } from '../../shared/stat-card.component';
import { PageCardComponent } from '../../shared/page-card.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, PageHeaderComponent, StatCardComponent, PageCardComponent],
  template: `
    <div class="min-h-screen bg-gradient-to-br from-slate-50 to-slate-200 p-8">
      <app-page-header title="Dashboard" (onBack)="goBack()"></app-page-header>

      <main class="max-w-7xl mx-auto">
        <!-- Stats Grid - Le stat-card sono qui! -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <app-stat-card
            class="bg-white shadow rounded-lg p-4"
            title="Total Vehicles"
            [value]="24"
            label="In Fleet"
          ></app-stat-card>
          <app-stat-card title="Active" [value]="18" label="On Road"></app-stat-card>
          <app-stat-card title="In Maintenance" [value]="3" label="In Service"></app-stat-card>
          <app-stat-card title="Alerts" [value]="2" label="Requires Attention"></app-stat-card>
        </div>

        <!-- Overview Card -->
        <app-page-card>
          <div class="space-y-6">
            <div>
              <h2 class="text-2xl font-bold text-gray-800 mb-4">Fleet Overview</h2>
              <p class="text-gray-600 text-lg leading-relaxed">
                Welcome to the Fleet Management Dashboard. Here you can view real-time statistics
                and monitor your fleet status.
              </p>
            </div>

            <div class="grid md:grid-cols-2 gap-8">
              <div>
                <h3 class="text-lg font-semibold text-gray-800 mb-3">Key Features</h3>
                <ul class="space-y-3">
                  <li class="flex items-center text-gray-700">
                    <div class="w-2 h-2 bg-indigo-500 rounded-full mr-4"></div>
                    Real-time vehicle tracking
                  </li>
                  <li class="flex items-center text-gray-700">
                    <div class="w-2 h-2 bg-green-500 rounded-full mr-4"></div>
                    Performance metrics
                  </li>
                  <li class="flex items-center text-gray-700">
                    <div class="w-2 h-2 bg-yellow-500 rounded-full mr-4"></div>
                    Maintenance scheduling
                  </li>
                  <li class="flex items-center text-gray-700">
                    <div class="w-2 h-2 bg-purple-500 rounded-full mr-4"></div>
                    Driver management
                  </li>
                </ul>
              </div>

              <div class="bg-gradient-to-br from-indigo-50 to-purple-50 p-6 rounded-xl">
                <h3 class="text-lg font-semibold text-gray-800 mb-3">Quick Actions</h3>
                <div class="space-y-3">
                  <button
                    class="w-full px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                  >
                    Add New Vehicle
                  </button>
                  <button
                    class="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    Schedule Maintenance
                  </button>
                  <button
                    class="w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                  >
                    View Reports
                  </button>
                </div>
              </div>
            </div>
          </div>
        </app-page-card>
      </main>
    </div>
  `,
  styles: [],
})
export class DashboardComponent {
  constructor(private router: Router) {}

  goBack() {
    this.router.navigate(['/home']);
  }
}
