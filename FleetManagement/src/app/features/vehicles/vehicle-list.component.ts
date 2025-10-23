import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { MainLayoutComponent } from '../../shared/main-layout.component';

@Component({
  selector: 'app-vehicle-list',
  standalone: true,
  imports: [MainLayoutComponent],
  template: `
    <app-main-layout>
      <div class="page-container">
        <header class="page-header">
          <h1>Vehicle List</h1>
          <button class="btn-back" (click)="goBack()">Back to Home</button>
        </header>

        <main class="page-content">
          <div class="filter-section">
            <input type="text" placeholder="Search vehicles..." class="search-input" />
            <button class="btn-add">Add Vehicle</button>
          </div>

          <div class="vehicle-table">
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Model</th>
                  <th>Plate</th>
                  <th>Status</th>
                  <th>Driver</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                @for (vehicle of vehicles; track vehicle.id) {
                <tr>
                  <td>{{ vehicle.id }}</td>
                  <td>{{ vehicle.model }}</td>
                  <td>{{ vehicle.plate }}</td>
                  <td>
                    <span class="status-badge" [class]="vehicle.status.toLowerCase()">
                      {{ vehicle.status }}
                    </span>
                  </td>
                  <td>{{ vehicle.driver }}</td>
                  <td>
                    <button class="btn-action">View</button>
                    <button class="btn-action">Edit</button>
                  </td>
                </tr>
                }
              </tbody>
            </table>
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

      .filter-section {
        display: flex;
        gap: 1rem;
        margin-bottom: 1.5rem;
      }

      .search-input {
        flex: 1;
        padding: 0.75rem 1rem;
        border: 1px solid #e2e8f0;
        border-radius: 0.5rem;
        font-size: 1rem;
      }

      .btn-add {
        padding: 0.75rem 1.5rem;
        background: #48bb78;
        color: white;
        border: none;
        border-radius: 0.5rem;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.3s ease;
      }

      .btn-add:hover {
        background: #38a169;
      }

      .vehicle-table {
        background: white;
        border-radius: 1rem;
        overflow: hidden;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
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

      tbody tr:hover {
        background: #f7fafc;
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

      .status-badge.maintenance {
        background: #fed7d7;
        color: #742a2a;
      }

      .status-badge.parked {
        background: #bee3f8;
        color: #2c5282;
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

      @media (max-width: 768px) {
        .filter-section {
          flex-direction: column;
        }

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
export class VehicleListComponent {
  vehicles = [
    { id: 'V001', model: 'Ford Transit', plate: 'AB123CD', status: 'Active', driver: 'John Doe' },
    {
      id: 'V002',
      model: 'Mercedes Sprinter',
      plate: 'EF456GH',
      status: 'Maintenance',
      driver: 'N/A',
    },
    { id: 'V003', model: 'Fiat Ducato', plate: 'IJ789KL', status: 'Parked', driver: 'Jane Smith' },
    {
      id: 'V004',
      model: 'Volkswagen Crafter',
      plate: 'MN012OP',
      status: 'Active',
      driver: 'Bob Wilson',
    },
    {
      id: 'V005',
      model: 'Renault Master',
      plate: 'QR345ST',
      status: 'Active',
      driver: 'Alice Brown',
    },
  ];

  private router = inject(Router);

  goBack() {
    this.router.navigate(['/home']);
  }
}
