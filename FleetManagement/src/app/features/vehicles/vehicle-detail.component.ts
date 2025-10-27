import { Component, inject, output } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-vehicle-detail',
  standalone: true,
  imports: [],
  template: `
    <div class="page-container">
      <header class="page-header">
        <h1>Vehicle Details</h1>
        <button class="btn-back" (click)="goBack()">Back to Home</button>
      </header>

      <main class="page-content">
        <div class="detail-card">
          <div class="vehicle-header">
            <div class="vehicle-title">
              <h2>Ford Transit</h2>
              <p>ID: V001 | Plate: AB123CD</p>
            </div>
          </div>

          <div class="detail-grid">
            <div class="detail-item">
              <label>Model</label>
              <p>Ford Transit</p>
            </div>
            <div class="detail-item">
              <label>Year</label>
              <p>2022</p>
            </div>
            <div class="detail-item">
              <label>Status</label>
              <p><span class="status-badge active">Active</span></p>
            </div>
            <div class="detail-item">
              <label>Driver</label>
              <p>John Doe</p>
            </div>
            <div class="detail-item">
              <label>Mileage</label>
              <p>45,230 km</p>
            </div>
            <div class="detail-item">
              <label>Fuel Type</label>
              <p>Diesel</p>
            </div>
            <div class="detail-item">
              <label>Last Service</label>
              <p>15/09/2025</p>
            </div>
            <div class="detail-item">
              <label>Next Service</label>
              <p>15/12/2025</p>
            </div>
          </div>

          <div class="actions">
            <button class="btn-primary">Edit Vehicle</button>
            <button class="btn-secondary">View History</button>
            <button class="btn-danger">Delete</button>
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
        max-width: 1000px;
        margin: 0 auto;
      }

      .detail-card {
        background: white;
        border-radius: 1rem;
        padding: 2rem;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      }

      .vehicle-header {
        display: flex;
        align-items: center;
        gap: 1.5rem;
        margin-bottom: 2rem;
        padding-bottom: 1.5rem;
        border-bottom: 2px solid #e2e8f0;
      }

      .vehicle-icon {
        font-size: 4rem;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        width: 80px;
        height: 80px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 1rem;
      }

      .vehicle-title h2 {
        font-size: 1.75rem;
        color: #2d3748;
        margin-bottom: 0.5rem;
      }

      .vehicle-title p {
        color: #718096;
        font-size: 0.875rem;
      }

      .detail-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 1.5rem;
        margin-bottom: 2rem;
      }

      .detail-item label {
        display: block;
        font-size: 0.875rem;
        font-weight: 600;
        color: #718096;
        margin-bottom: 0.5rem;
      }

      .detail-item p {
        font-size: 1rem;
        color: #2d3748;
        margin: 0;
      }

      .status-badge {
        padding: 0.25rem 0.75rem;
        border-radius: 1rem;
        font-size: 0.875rem;
        font-weight: 600;
      }

      .status-badge.active {
        background: #c6f6d5;
        color: #22543d;
      }

      .actions {
        display: flex;
        gap: 1rem;
        padding-top: 1.5rem;
        border-top: 2px solid #e2e8f0;
      }

      .btn-primary,
      .btn-secondary,
      .btn-danger {
        padding: 0.75rem 1.5rem;
        border: none;
        border-radius: 0.5rem;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.3s ease;
      }

      .btn-primary {
        background: #667eea;
        color: white;
      }

      .btn-primary:hover {
        background: #5a67d8;
      }

      .btn-secondary {
        background: #e2e8f0;
        color: #2d3748;
      }

      .btn-secondary:hover {
        background: #cbd5e0;
      }

      .btn-danger {
        background: #fc8181;
        color: white;
      }

      .btn-danger:hover {
        background: #f56565;
      }

      @media (max-width: 768px) {
        .detail-grid {
          grid-template-columns: 1fr;
        }

        .actions {
          flex-direction: column;
        }
      }
    `,
  ],
})
export class VehicleDetailComponent {
  private router = inject(Router);
  closeModal = output<boolean>();

  goBack() {
    this.closeModal.emit(true);
    this.router.navigate(['/home']);
  }
}
