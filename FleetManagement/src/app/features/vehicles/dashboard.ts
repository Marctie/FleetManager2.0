import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { PageHeaderComponent } from '../../shared/page-header.component';
import { StatCardComponent } from '../../shared/stat-card.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [PageHeaderComponent, StatCardComponent],
  template: `
    <div class="dashboard-container">
      <app-page-header title="Dashboard" (onBack)="goBack()"></app-page-header>

      <main class="dashboard-main">
        <div class="stats-grid">
          <app-stat-card title="Total Vehicles" [value]="24" label="In Fleet"></app-stat-card>
          <app-stat-card title="Active" [value]="18" label="On Road"></app-stat-card>
          <app-stat-card title="In Maintenance" [value]="3" label="In Service"></app-stat-card>
          <app-stat-card title="Alerts" [value]="2" label="Requires Attention"></app-stat-card>
        </div>
      </main>
    </div>
  `,
  styles: [
    `
      .dashboard-container {
        min-height: 100vh;
        background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
        padding: 2rem;
      }

      .dashboard-main {
        max-width: 80rem;
        margin: 0 auto;
      }

      .stats-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: 1.5rem;
        margin-bottom: 2rem;
      }

      @media (max-width: 640px) {
        .dashboard-container {
          padding: 1rem;
        }

        .stats-grid {
          gap: 1rem;
        }
      }
    `,
  ],
})
export class DashboardComponent {
  private router = inject(Router);

  goBack() {
    this.router.navigate(['/home']);
  }
}
