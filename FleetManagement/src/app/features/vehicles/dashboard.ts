import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { PageHeaderComponent } from '../../shared/page-header.component';
import { StatCardComponent } from '../../shared/stat-card.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [PageHeaderComponent, StatCardComponent],
  template: `
    <div class="min-h-screen bg-gradient-to-br from-slate-50 to-slate-200 p-8">
      <app-page-header title="Dashboard" (onBack)="goBack()"></app-page-header>

      <main class="max-w-7xl mx-auto">
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <app-stat-card title="Total Vehicles" [value]="24" label="In Fleet"></app-stat-card>
          <app-stat-card title="Active" [value]="18" label="On Road"></app-stat-card>
          <app-stat-card title="In Maintenance" [value]="3" label="In Service"></app-stat-card>
          <app-stat-card title="Alerts" [value]="2" label="Requires Attention"></app-stat-card>
        </div>
      </main>
    </div>
  `,
  styles: [],
})
export class DashboardComponent {
  private router = inject(Router);

  goBack() {
    this.router.navigate(['/home']);
  }
}
