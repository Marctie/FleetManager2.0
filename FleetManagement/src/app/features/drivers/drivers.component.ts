import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-drivers',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="page-container">
      <header class="page-header">
        <h1>Drivers Management</h1>
        <button class="btn-back" (click)="goBack()">Back to Home</button>
      </header>

      <main class="page-content">
        <div class="stats-row">
          <div class="stat-card">
            <span class="stat-label">Active Drivers</span>
          </div>
          <div class="stat-card">
            <span class="stat-label">On Duty</span>
          </div>
          <div class="stat-card">
            <span class="stat-label">Off Duty</span>
          </div>
        </div>

        <div class="content-card">
          <h2>Driver Assignments</h2>
          <p>Manage driver assignments and schedules</p>
          <div class="placeholder">
            <p>Driver management interface will be implemented here</p>
          </div>
        </div>
      </main>
    </div>
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

      .stats-row {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 1.5rem;
        margin-bottom: 2rem;
      }

      .stat-card {
        background: white;
        padding: 1.5rem;
        border-radius: 1rem;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        display: flex;
        flex-direction: column;
        align-items: center;
      }

      .stat-value {
        font-size: 2.5rem;
        font-weight: 700;
        color: #667eea;
        margin-bottom: 0.5rem;
      }

      .stat-label {
        font-size: 0.875rem;
        color: #718096;
        text-align: center;
      }

      .content-card {
        background: white;
        padding: 2rem;
        border-radius: 1rem;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      }

      .content-card h2 {
        font-size: 1.5rem;
        color: #2d3748;
        margin-bottom: 0.5rem;
        font-weight: 600;
      }

      .content-card p {
        color: #718096;
        margin-bottom: 2rem;
      }

      .placeholder {
        text-align: center;
        padding: 3rem;
        background: #f7fafc;
        border-radius: 0.5rem;
        border: 2px dashed #e2e8f0;
      }

      .placeholder p {
        color: #a0aec0;
        font-size: 1rem;
      }

      @media (max-width: 768px) {
        .page-container {
          padding: 1rem;
        }

        .page-header {
          flex-direction: column;
          gap: 1rem;
          align-items: flex-start;
        }

        .page-header h1 {
          font-size: 1.5rem;
        }
      }
    `,
  ],
})
export class DriversComponent {
  constructor(private router: Router) {}

  goBack() {
    this.router.navigate(['/home']);
  }
}
