import { Component, OnInit, inject, signal, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MainLayoutComponent } from '../shared/main-layout.component';
import { UserService } from '../services/user.service';
import { VehicleService } from '../services/vehicle.service';
import { IUser } from '../models/IUser';
import { IVehicle } from '../models/IVehicle';

@Component({
  selector: 'app-associations',
  standalone: true,
  imports: [CommonModule, MainLayoutComponent, FormsModule],
  template: `
    <app-main-layout>
      <div class="page-container">
        <header class="page-header">
          <h1>Driver-Vehicle Associations</h1>
          <button class="btn-back" (click)="goBack()">Back to Home</button>
        </header>

        <main class="page-content">
          @if (isLoadingDrivers()) {
          <div class="loading-state">Loading drivers...</div>
          } @else if (drivers().length === 0) {
          <div class="empty-state">
            <h2>No Drivers Found</h2>
            <p>There are no users with the Driver role in the system.</p>
          </div>
          } @else {
          <div class="drivers-grid">
            @for (driver of drivers(); track driver.id) {
            <div class="driver-card">
              <div class="driver-info">
                <div class="driver-avatar">
                  {{ getInitials(driver.fullName || driver.username) }}
                </div>
                <div class="driver-details">
                  <h3>{{ driver.fullName || driver.username }}</h3>
                  <p class="driver-email">{{ driver.email }}</p>
                  <span class="driver-role-badge">{{ driver.role }}</span>
                </div>
              </div>

              <div class="driver-stats">
                <div class="stat-item">
                  <span class="stat-label">Assigned Vehicles</span>
                  <span class="stat-value">{{ getDriverVehicleCount(driver.id) }}</span>
                </div>
              </div>

              <button class="btn-manage" (click)="openAssignModal(driver)">Manage Vehicles</button>
            </div>
            }
          </div>
          }

          <!-- Modal per gestire veicoli -->
          @if (showModal()) {
          <div class="modal-overlay" (click)="closeModal()">
            <div class="modal-container" (click)="$event.stopPropagation()">
              <div class="modal-header">
                <div>
                  <h2>
                    Manage Vehicles for
                    {{ selectedDriver()?.fullName || selectedDriver()?.username }}
                  </h2>
                  <p class="modal-subtitle">{{ selectedDriver()?.email }}</p>
                </div>
                <button class="btn-close" (click)="closeModal()">&times;</button>
              </div>

              <div class="modal-body">
                <!-- Veicoli già assegnati -->
                <div class="section">
                  <h3>Assigned Vehicles</h3>
                  @if (assignedVehicles().length === 0) {
                  <div class="info-message">No vehicles currently assigned to this driver.</div>
                  } @else {
                  <div class="vehicles-list">
                    @for (vehicle of assignedVehicles(); track vehicle.id) {
                    <div class="vehicle-item assigned">
                      <div class="vehicle-info">
                        <strong>{{ vehicle.brand }} {{ vehicle.model }}</strong>
                        <span class="vehicle-plate">{{ vehicle.licensePlate }}</span>
                      </div>
                      <button
                        class="btn-documents"
                        (click)="viewVehicleDocuments(vehicle)"
                        title="View Documents"
                      >
                        Documents
                      </button>
                    </div>
                    }
                  </div>
                  }
                </div>

                <!-- Veicoli disponibili per assegnazione -->
                <div class="section">
                  <h3>Available Vehicles</h3>
                  @if (isLoadingVehicles()) {
                  <div class="loading-mini">Loading vehicles...</div>
                  } @else if (availableVehicles().length === 0) {
                  <div class="info-message">No available vehicles to assign.</div>
                  } @else {
                  <div class="vehicles-list">
                    @for (vehicle of availableVehicles(); track vehicle.id) {
                    <div class="vehicle-item available">
                      <div class="vehicle-info">
                        <strong>{{ vehicle.brand }} {{ vehicle.model }}</strong>
                        <span class="vehicle-plate">{{ vehicle.licensePlate }}</span>
                        <span class="vehicle-status">{{ getStatusLabel(+vehicle.status) }}</span>
                      </div>
                      <button
                        class="btn-assign"
                        (click)="assignVehicleToDriver(vehicle)"
                        [disabled]="isProcessing()"
                      >
                        Assign
                      </button>
                    </div>
                    }
                  </div>
                  }
                </div>
              </div>

              <div class="modal-footer">
                <button class="btn-secondary" (click)="closeModal()">Close</button>
              </div>
            </div>
          </div>
          }
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

      .loading-state,
      .empty-state {
        background: white;
        border-radius: 1rem;
        padding: 4rem 2rem;
        text-align: center;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      }

      .loading-state {
        color: #667eea;
        font-weight: 600;
      }

      .empty-state h2 {
        font-size: 1.5rem;
        color: #2d3748;
        margin-bottom: 0.5rem;
      }

      .empty-state p {
        color: #718096;
      }

      .drivers-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
        gap: 1.5rem;
      }

      .driver-card {
        background: white;
        border-radius: 1rem;
        padding: 1.5rem;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        transition: all 0.3s ease;
      }

      .driver-card:hover {
        transform: translateY(-4px);
        box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15);
      }

      .driver-info {
        display: flex;
        align-items: center;
        gap: 1rem;
        margin-bottom: 1rem;
        padding-bottom: 1rem;
        border-bottom: 2px solid #e2e8f0;
      }

      .driver-avatar {
        width: 60px;
        height: 60px;
        border-radius: 50%;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 1.25rem;
        font-weight: 700;
        flex-shrink: 0;
      }

      .driver-details {
        flex: 1;
        min-width: 0;
      }

      .driver-details h3 {
        margin: 0 0 0.25rem 0;
        color: #2d3748;
        font-size: 1.125rem;
        font-weight: 600;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .driver-email {
        margin: 0;
        font-size: 0.875rem;
        color: #718096;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .driver-role-badge {
        display: inline-block;
        margin-top: 0.5rem;
        padding: 0.25rem 0.75rem;
        background: #c6f6d5;
        color: #22543d;
        border-radius: 1rem;
        font-size: 0.75rem;
        font-weight: 600;
        text-transform: uppercase;
      }

      .driver-stats {
        margin-bottom: 1rem;
      }

      .stat-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0.75rem;
        background: #f7fafc;
        border-radius: 0.5rem;
      }

      .stat-label {
        font-size: 0.875rem;
        color: #718096;
      }

      .stat-value {
        font-size: 1.25rem;
        font-weight: 700;
        color: #667eea;
      }

      .btn-manage {
        width: 100%;
        padding: 0.75rem;
        background: linear-gradient(135deg, #48bb78 0%, #38a169 100%);
        color: white;
        border: none;
        border-radius: 0.5rem;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.3s ease;
      }

      .btn-manage:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(72, 187, 120, 0.3);
      }

      /* Modal Styles */
      .modal-overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.5);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 2000;
        animation: fadeIn 0.2s ease;
      }

      @keyframes fadeIn {
        from {
          opacity: 0;
        }
        to {
          opacity: 1;
        }
      }

      .modal-container {
        background: white;
        border-radius: 1rem;
        width: 90%;
        max-width: 700px;
        max-height: 80vh;
        overflow-y: auto;
        box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
        animation: slideUp 0.3s ease;
      }

      @keyframes slideUp {
        from {
          transform: translateY(20px);
          opacity: 0;
        }
        to {
          transform: translateY(0);
          opacity: 1;
        }
      }

      .modal-header {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        padding: 1.5rem;
        border-bottom: 2px solid #e2e8f0;
      }

      .modal-header h2 {
        font-size: 1.5rem;
        color: #2d3748;
        font-weight: 700;
        margin: 0;
      }

      .modal-subtitle {
        margin: 0.25rem 0 0 0;
        font-size: 0.875rem;
        color: #718096;
      }

      .btn-close {
        background: none;
        border: none;
        font-size: 2rem;
        color: #718096;
        cursor: pointer;
        line-height: 1;
        padding: 0;
        width: 2rem;
        height: 2rem;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: color 0.2s ease;
      }

      .btn-close:hover {
        color: #2d3748;
      }

      .modal-body {
        padding: 1.5rem;
      }

      .section {
        margin-bottom: 2rem;
      }

      .section:last-child {
        margin-bottom: 0;
      }

      .section h3 {
        font-size: 1.125rem;
        color: #2d3748;
        margin: 0 0 1rem 0;
        font-weight: 600;
      }

      .info-message {
        background: #ebf8ff;
        border: 1px solid #90cdf4;
        border-radius: 0.5rem;
        padding: 1rem;
        color: #2c5282;
        font-size: 0.875rem;
      }

      .loading-mini {
        text-align: center;
        padding: 1rem;
        color: #718096;
        font-size: 0.875rem;
      }

      .vehicles-list {
        display: flex;
        flex-direction: column;
        gap: 0.75rem;
      }

      .vehicle-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 1rem;
        border-radius: 0.5rem;
        transition: all 0.2s ease;
      }

      .vehicle-item.assigned {
        background: #f0fff4;
        border: 1px solid #c6f6d5;
      }

      .vehicle-item.available {
        background: #f7fafc;
        border: 1px solid #e2e8f0;
      }

      .vehicle-item:hover {
        transform: translateX(4px);
      }

      .vehicle-info {
        display: flex;
        flex-direction: column;
        gap: 0.25rem;
        flex: 1;
      }

      .vehicle-info strong {
        color: #2d3748;
        font-size: 1rem;
      }

      .vehicle-plate {
        font-size: 0.875rem;
        color: #718096;
      }

      .vehicle-status {
        font-size: 0.75rem;
        padding: 0.25rem 0.5rem;
        background: #bee3f8;
        color: #2c5282;
        border-radius: 0.25rem;
        display: inline-block;
        margin-top: 0.25rem;
        font-weight: 600;
      }

      .btn-assign,
      .btn-documents {
        padding: 0.5rem 1rem;
        border: none;
        border-radius: 0.375rem;
        font-weight: 600;
        cursor: pointer;
        font-size: 0.875rem;
        transition: all 0.2s ease;
      }

      .btn-assign {
        background: #48bb78;
        color: white;
      }

      .btn-assign:hover:not(:disabled) {
        background: #38a169;
      }

      .btn-documents {
        background: #667eea;
        color: white;
        display: flex;
        align-items: center;
        gap: 0.25rem;
      }

      .btn-documents:hover {
        background: #5a67d8;
        transform: translateY(-1px);
        box-shadow: 0 2px 8px rgba(102, 126, 234, 0.3);
      }

      .btn-assign:disabled {
        opacity: 0.5;
        cursor: not-allowed;
      }

      .modal-footer {
        display: flex;
        gap: 1rem;
        padding: 1.5rem;
        border-top: 2px solid #e2e8f0;
        justify-content: flex-end;
      }

      .btn-secondary {
        padding: 0.75rem 1.5rem;
        background: #e2e8f0;
        color: #2d3748;
        border: none;
        border-radius: 0.5rem;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.3s ease;
      }

      .btn-secondary:hover {
        background: #cbd5e0;
      }

      @media (max-width: 768px) {
        .page-container {
          padding: 1rem;
        }

        .drivers-grid {
          grid-template-columns: 1fr;
        }

        .modal-container {
          width: 95%;
          max-height: 90vh;
        }
      }
    `,
  ],
})
export class AssociationsComponent implements OnInit {
  private router = inject(Router);
  private userService = inject(UserService);
  private vehicleService = inject(VehicleService);

  // Signals
  drivers = signal<IUser[]>([]);
  allVehicles = signal<IVehicle[]>([]);
  selectedDriver = signal<IUser | null>(null);
  showModal = signal(false);
  isLoadingDrivers = signal(false);
  isLoadingVehicles = signal(false);
  isProcessing = signal(false);
  assignedVehicles = signal<IVehicle[]>([]);
  availableVehicles = signal<IVehicle[]>([]);

  constructor() {
    // Effect per aggiornare le liste quando cambia il driver selezionato o i veicoli
    effect(() => {
      this.updateVehicleLists();
    });
  }

  ngOnInit() {
    this.loadDrivers();
    this.loadVehicles();
  }

  loadDrivers() {
    this.isLoadingDrivers.set(true);
    this.userService.getUsers().subscribe({
      next: (users) => {
        const driversList = users.filter((u) => u.role === 'Driver');
        this.drivers.set(driversList);
        this.isLoadingDrivers.set(false);
      },
      error: (error) => {
        console.error('[AssociationsComponent] Error loading drivers:', error);
        this.isLoadingDrivers.set(false);
      },
    });
  }

  loadVehicles() {
    this.isLoadingVehicles.set(true);
    this.vehicleService.getListVehicles().subscribe({
      next: (response) => {
        this.allVehicles.set(response.items);
        this.isLoadingVehicles.set(false);
      },
      error: (error) => {
        console.error('[AssociationsComponent] Error loading vehicles:', error);
        this.isLoadingVehicles.set(false);
      },
    });
  }

  getInitials(name: string): string {
    if (!name) return '??';
    const parts = name.trim().split(' ');
    if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }

  getDriverVehicleCount(driverId: string): number {
    return this.allVehicles().filter((v) => v.assignedDriverId === driverId).length;
  }

  openAssignModal(driver: IUser) {
    this.selectedDriver.set(driver);
    this.showModal.set(true);
  }

  closeModal() {
    this.showModal.set(false);
    this.selectedDriver.set(null);
  }

  private updateVehicleLists() {
    const driver = this.selectedDriver();
    if (!driver) {
      this.assignedVehicles.set([]);
      this.availableVehicles.set([]);
      return;
    }

    const assigned = this.allVehicles().filter((v) => v.assignedDriverId === driver.id);
    const available = this.allVehicles().filter((v) => !v.assignedDriverId);

    this.assignedVehicles.set(assigned);
    this.availableVehicles.set(available);
  }

  assignVehicleToDriver(vehicle: IVehicle) {
    const driver = this.selectedDriver();
    if (!driver) return;

    this.isProcessing.set(true);
    this.vehicleService.assignVehicle(vehicle.id, driver.id).subscribe({
      next: () => {
        // Aggiorna il veicolo nella lista
        const vehicles = this.allVehicles();
        const index = vehicles.findIndex((v) => v.id === vehicle.id);
        if (index !== -1) {
          vehicles[index] = {
            ...vehicles[index],
            assignedDriverId: driver.id,
            assignedDriverName: driver.fullName || driver.username,
          };
          this.allVehicles.set([...vehicles]);
          this.updateVehicleLists();
        }
        this.isProcessing.set(false);
      },
      error: (error) => {
        console.error('[AssociationsComponent] Error assigning vehicle:', error);
        alert('Failed to assign vehicle. Please try again.');
        this.isProcessing.set(false);
      },
    });
  }

  viewVehicleDocuments(vehicle: IVehicle) {
    this.closeModal();
    this.router.navigate(['/documents'], {
      queryParams: { vehicleId: vehicle.id },
    });
  }

  getStatusLabel(status: number): string {
    const labels: { [key: number]: string } = {
      0: 'Available',
      1: 'In Use',
      2: 'Maintenance',
      3: 'Out of Service',
    };
    return labels[status] || 'Unknown';
  }

  goBack() {
    this.router.navigate(['/home']);
  }
}
