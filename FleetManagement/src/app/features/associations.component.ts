import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MainLayoutComponent } from '../shared/main-layout.component';

@Component({
  selector: 'app-associations',
  standalone: true,
  imports: [CommonModule, MainLayoutComponent],
  template: `
    <app-main-layout>
      <div class="page-container">
        <header class="page-header">
          <h1>Associations Management</h1>
          <button class="btn-back" (click)="goBack()">Back to Home</button>
        </header>

        <main class="page-content">
          <div class="coming-soon"></div>

          <!-- CODICE TEMPORANEAMENTE NASCOSTO - DA IMPLEMENTARE-->
          
          <div class="associations-table">
            <table>
              <thead>
                <tr>
                  <th>Vehicle</th>
                  <th>Driver</th>
                  <th>Start Date</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                @for (assoc of associations; track $index) {
                <tr>
                  <td>
                    <div class="vehicle-cell">
                      <strong>{{ assoc.vehicleId }}</strong>
                      <span>{{ assoc.vehicleName }}</span>
                    </div>
                  </td>
                  <td>{{ assoc.driverName }}</td>
                  <td>{{ assoc.startDate }}</td>
                  <td>
                    <span class="status-badge" [class]="assoc.status">
                      {{ assoc.status }}
                    </span>
                  </td>
                  <td>
                    <button class="btn-action">Edit</button>
                    <button class="btn-action danger">Remove</button>
                  </td>
                </tr>
                }
              </tbody>
            </table>
          </div>

          <button class="btn-create">Create New Association</button>
          
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
        max-width: 1200px;
        margin: 0 auto;
      }

      .info-banner {
        background: #ebf8ff;
        border-left: 4px solid #4299e1;
        padding: 1rem 1.5rem;
        border-radius: 0.5rem;
        margin-bottom: 2rem;
      }

      .info-banner p {
        color: #2c5282;
        margin: 0;
        font-weight: 500;
      }

      .associations-table {
        background: white;
        border-radius: 1rem;
        overflow: hidden;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        margin-bottom: 1.5rem;
      }

      table {
        width: 100%;
        border-collapse: collapse;
      }

      thead {
        background: #f7fafc;
      }

      th {
        padding: 1rem;
        text-align: left;
        font-weight: 600;
        color: #2d3748;
        border-bottom: 2px solid #e2e8f0;
      }

      td {
        padding: 1rem;
        border-bottom: 1px solid #e2e8f0;
        color: #4a5568;
      }

      .vehicle-cell {
        display: flex;
        flex-direction: column;
        gap: 0.25rem;
      }

      .vehicle-cell strong {
        color: #2d3748;
      }

      .vehicle-cell span {
        font-size: 0.875rem;
        color: #718096;
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

      .status-badge.pending {
        background: #feebc8;
        color: #7c2d12;
      }

      .btn-action {
        padding: 0.5rem 1rem;
        margin-right: 0.5rem;
        background: #667eea;
        color: white;
        border: none;
        border-radius: 0.25rem;
        cursor: pointer;
        font-size: 0.875rem;
      }

      .btn-action:hover {
        background: #5a67d8;
      }

      .btn-action.danger {
        background: #fc8181;
      }

      .btn-action.danger:hover {
        background: #f56565;
      }

      .btn-create {
        padding: 1rem 2rem;
        background: #48bb78;
        color: white;
        border: none;
        border-radius: 0.5rem;
        font-weight: 600;
        font-size: 1rem;
        cursor: pointer;
        transition: all 0.3s ease;
      }

      .btn-create:hover {
        background: #38a169;
        transform: translateY(-2px);
      }

      .coming-soon {
        background: white;
        border-radius: 1rem;
        padding: 4rem 2rem;
        text-align: center;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      }

      .coming-soon h2 {
        font-size: 2rem;
        color: #2d3748;
        margin-bottom: 1rem;
      }

      .coming-soon p {
        color: #718096;
        font-size: 1.125rem;
      }

      @media (max-width: 768px) {
        table {
          font-size: 0.875rem;
        }

        th,
        td {
          padding: 0.5rem;
        }
      }
    `,
  ],
})
export class AssociationsComponent {
  // DATI TEMPORANEAMENTE COMMENTATI - DA RIATTIVARE
  
  associations = [
    {
      vehicleId: 'V001',
      vehicleName: 'Ford Transit',
      driverName: 'John Doe',
      startDate: '01/10/2025',
      status: 'active',
    },
  ];
  

  constructor(private router: Router) {}

  goBack() {
    this.router.navigate(['/home']);
  }
}
