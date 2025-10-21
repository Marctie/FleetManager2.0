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
    <div class="page-container">
      <app-page-header title="Dashboard" (onBack)="goBack()"></app-page-header>

      <main class="page-content">
        <div class="stats-grid">
          <app-stat-card title="Total Vehicles" [value]="24"></app-stat-card>
          <app-stat-card title="Active" [value]="18"></app-stat-card>
          <app-stat-card title="In Maintenance" [value]="3"></app-stat-card>
          <app-stat-card title="Alerts" [value]="2"></app-stat-card>
        </div>

        <app-page-card>
          <h2>Overview</h2>
          <p>Welcome to the Fleet Management Dashboard. Here you can view real-time statistics and monitor your fleet status.</p>
          <ul>
            <li>Real-time vehicle tracking</li>
            <li>Performance metrics</li>
            <li>Maintenance scheduling</li>
            <li>Driver management</li>
          </ul>
        </app-page-card>
      </main>
    </div>
  `,
  styles: [`
    .page-container {
      min-height: 100vh;
      background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
      padding: 2rem;
    }

    .page-content {
      max-width: 1400px;
      margin: 0 auto;
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 1.5rem;
      margin-bottom: 2rem;
    }

    h2 {
      font-size: 1.5rem;
      color: #2d3748;
      margin-bottom: 1rem;
    }

    p {
      color: #718096;
      line-height: 1.6;
      margin-bottom: 1.5rem;
    }

    ul {
      list-style: none;
      padding: 0;
    }

    li {
      padding: 0.5rem 0;
      color: #4a5568;
      font-size: 1rem;
      padding-left: 1.5rem;
      position: relative;
    }

    li:before {
      content: "";
      position: absolute;
      left: 0;
      top: 50%;
      transform: translateY(-50%);
      width: 6px;
      height: 6px;
      background: #667eea;
      border-radius: 50%;
    }
  `]
})
export class DashboardComponent {
  constructor(private router: Router) {}

  goBack() {
    this.router.navigate(['/home']);
  }
}
