import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MainLayoutComponent } from '../shared/main-layout.component';

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [CommonModule, MainLayoutComponent],
  template: `
    <app-main-layout>
      <div class="page-container">
        <header class="page-header">
          <h1>Reports and Statistics</h1>
          <button class="btn-back" (click)="goBack()">Back to Home</button>
        </header>

        <main class="page-content">
          <div class="stats-overview">
            <div class="stat-card">
              <div class="stat-content">
                <h3>Total Distance</h3>
                <p class="stat-value">125,450 km</p>
              </div>
            </div>
            <div class="stat-card">
              <div class="stat-content">
                <h3>Fuel Consumption</h3>
                <p class="stat-value">8,240 L</p>
              </div>
            </div>
            <div class="stat-card">
              <div class="stat-content">
                <h3>Total Costs</h3>
                <p class="stat-value">€15,320</p>
              </div>
            </div>
            <div class="stat-card">
              <div class="stat-content">
                <h3>Maintenance</h3>
                <p class="stat-value">€3,450</p>
              </div>
            </div>
          </div>

          <div class="reports-grid">
            <div class="report-card">
              <h3>Monthly Report</h3>
              <p>Comprehensive monthly fleet analysis</p>
              <button class="btn-download">Download PDF</button>
            </div>
            <div class="report-card">
              <h3>Trip History</h3>
              <p>Detailed trip logs and routes</p>
              <button class="btn-download">Download PDF</button>
            </div>
            <div class="report-card">
              <h3>Maintenance Log</h3>
              <p>All maintenance activities</p>
              <button class="btn-download">Download PDF</button>
            </div>
            <div class="report-card">
              <h3>Cost Analysis</h3>
              <p>Expense breakdown and trends</p>
              <button class="btn-download">Download PDF</button>
            </div>
          </div>
        </main>
      </div>
    </app-main-layout>
  `,
  styles: [
    `
      .page-container {
        min-height: 100vh;
        background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
        padding: 2rem;
      }

      .page-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 2rem;
      }

      .page-header h1 {
        font-size: 2rem;
        color: #2d3748;
        font-weight: 700;
      }

      .btn-back {
        padding: 0.75rem 1.5rem;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        border: none;
        border-radius: 0.5rem;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.3s ease;
      }

      .btn-back:hover {
        transform: translateY(-2px);
        box-shadow: 0 5px 15px rgba(102, 126, 234, 0.3);
      }

      .page-content {
        max-width: 1400px;
        margin: 0 auto;
      }

      .stats-overview {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: 1.5rem;
        margin-bottom: 2rem;
      }

      .stat-card {
        background: white;
        padding: 1.5rem;
        border-radius: 1rem;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      }

      .stat-content h3 {
        font-size: 0.875rem;
        color: #718096;
        margin-bottom: 0.5rem;
      }

      .stat-value {
        font-size: 1.75rem;
        font-weight: 700;
        color: #2d3748;
        margin: 0.5rem 0;
      }

      .stat-trend {
        font-size: 0.75rem;
        font-weight: 600;
        padding: 0.25rem 0.5rem;
        border-radius: 0.25rem;
      }

      .stat-trend.positive {
        background: #c6f6d5;
        color: #22543d;
      }

      .stat-trend.negative {
        background: #fed7d7;
        color: #742a2a;
      }

      .reports-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
        gap: 1.5rem;
      }

      .report-card {
        background: white;
        padding: 2rem;
        border-radius: 1rem;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        transition: transform 0.3s ease;
      }

      .report-card:hover {
        transform: translateY(-5px);
      }

      .report-card h3 {
        font-size: 1.25rem;
        color: #2d3748;
        margin-bottom: 0.75rem;
      }

      .report-card p {
        color: #718096;
        margin-bottom: 1.5rem;
        font-size: 0.875rem;
      }

      .btn-download {
        width: 100%;
        padding: 0.75rem;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        border: none;
        border-radius: 0.5rem;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.3s ease;
      }

      .btn-download:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
      }

      @media (max-width: 768px) {
        .stats-overview {
          grid-template-columns: 1fr;
        }
      }
    `,
  ],
})
export class ReportsComponent {
  constructor(private router: Router) {}

  goBack() {
    this.router.navigate(['/home']);
  }
}
