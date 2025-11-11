import { Component, EventEmitter, Input, Output, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IVehicle } from '../../models/IVehicle';
import { VehicleService } from '../../services/vehicle.service';

@Component({
  selector: 'app-vehicle-status-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="modal-overlay" (click)="onOverlayClick($event)">
      <div class="modal-content" (click)="$event.stopPropagation()">
        <div class="modal-header">
          <h2>Change Vehicle Status</h2>
          <button class="btn-close" (click)="close()">&times;</button>
        </div>

        <div class="modal-body">
          <div class="vehicle-info">
            <p class="vehicle-name">{{ vehicle.brand }} {{ vehicle.model }}</p>
            <p class="vehicle-plate">{{ vehicle.licensePlate }}</p>
            <p class="current-status">
              Current Status:
              <span class="status-badge" [class]="vehicle.status.toLowerCase()">
                {{ vehicle.status }}
              </span>
            </p>
          </div>

          @if (error()) {
          <div class="error-message">{{ error() }}</div>
          }

          <div class="form-group">
            <label for="newStatus">Select New Status</label>
            <select
              id="newStatus"
              [(ngModel)]="selectedStatus"
              class="status-select"
              [disabled]="isSaving()"
            >
              <option value="Available">Available</option>
              <option value="In Use">In Use</option>
              <option value="Maintenance">Maintenance</option>
              <option value="Out of Service">Out of Service</option>
            </select>
          </div>
        </div>

        <div class="modal-footer">
          <button class="btn-secondary" (click)="close()" [disabled]="isSaving()">Cancel</button>
          <button
            class="btn-status"
            (click)="updateStatus()"
            [disabled]="selectedStatus === vehicle.status || isSaving()"
          >
            {{ isSaving() ? 'Saving...' : 'Update Status' }}
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      .btn-status {
        padding: 0.75rem 1.5rem;
        border: none;
        border-radius: 0.5rem;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.3s ease;
        background: linear-gradient(135deg, #48bb78 0%, #38a169 100%);
        color: white;
      }

      .btn-status:hover {
        background: linear-gradient(135deg, #38a169 0%, #2f855a 100%);
        transform: translateY(-1px);
        box-shadow: 0 4px 12px rgba(72, 187, 120, 0.4);
      }
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
        animation: fadeIn 0.2s ease-out;
      }

      @keyframes fadeIn {
        from {
          opacity: 0;
        }
        to {
          opacity: 1;
        }
      }

      .modal-content {
        background: white;
        border-radius: 1rem;
        width: 90%;
        max-width: 500px;
        box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
        animation: slideUp 0.3s ease-out;
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
        align-items: center;
        padding: 1.5rem;
        border-bottom: 1px solid #e2e8f0;
      }

      .modal-header h2 {
        font-size: 1.5rem;
        color: #2d3748;
        margin: 0;
        font-weight: 700;
      }

      .btn-close {
        background: none;
        border: none;
        font-size: 2rem;
        color: #718096;
        cursor: pointer;
        padding: 0;
        width: 32px;
        height: 32px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 0.375rem;
        transition: all 0.2s ease;
      }

      .btn-close:hover {
        background: #f7fafc;
        color: #2d3748;
      }

      .modal-body {
        padding: 1.5rem;
      }

      .vehicle-info {
        background: #f7fafc;
        padding: 1rem;
        border-radius: 0.5rem;
        margin-bottom: 1.5rem;
      }

      .vehicle-name {
        font-size: 1.125rem;
        font-weight: 600;
        color: #2d3748;
        margin: 0 0 0.25rem 0;
      }

      .vehicle-plate {
        font-size: 0.875rem;
        color: #718096;
        margin: 0 0 0.75rem 0;
      }

      .current-status {
        font-size: 0.875rem;
        color: #4a5568;
        margin: 0;
        display: flex;
        align-items: center;
        gap: 0.5rem;
      }

      .status-badge {
        padding: 0.25rem 0.75rem;
        border-radius: 1rem;
        font-size: 0.75rem;
        font-weight: 600;
      }

      .status-badge.available {
        background: #c6f6d5;
        color: #22543d;
      }

      .status-badge.in.use,
      .status-badge.in {
        background: #bee3f8;
        color: #2c5282;
      }

      .status-badge.maintenance {
        background: #feebc8;
        color: #7c2d12;
      }

      .status-badge.out.of.service,
      .status-badge.out {
        background: #fed7d7;
        color: #742a2a;
      }

      .form-group {
        margin-bottom: 1.5rem;
      }

      .form-group label {
        display: block;
        font-size: 0.875rem;
        font-weight: 600;
        color: #2d3748;
        margin-bottom: 0.5rem;
      }

      .status-select {
        width: 100%;
        padding: 0.75rem;
        border: 2px solid #e2e8f0;
        border-radius: 0.5rem;
        font-size: 1rem;
        color: #2d3748;
        background: white;
        cursor: pointer;
        transition: all 0.2s ease;
      }

      .status-select:hover {
        border-color: #cbd5e0;
      }

      .status-select:focus {
        outline: none;
        border-color: #667eea;
        box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
      }

      .status-select:disabled {
        background: #f7fafc;
        cursor: not-allowed;
        opacity: 0.6;
      }

      .status-descriptions {
        background: #f7fafc;
        border-radius: 0.5rem;
        padding: 1rem;
      }

      .status-desc {
        padding: 0.5rem;
        margin-bottom: 0.5rem;
        border-radius: 0.375rem;
        font-size: 0.875rem;
        color: #4a5568;
        transition: all 0.2s ease;
      }

      .status-desc:last-child {
        margin-bottom: 0;
      }

      .status-desc.active {
        background: white;
        color: #2d3748;
        border-left: 3px solid #667eea;
        padding-left: 0.75rem;
      }

      .status-desc strong {
        color: #2d3748;
      }

      .error-message {
        background: #fed7d7;
        color: #742a2a;
        padding: 0.75rem;
        border-radius: 0.5rem;
        margin-bottom: 1rem;
        font-size: 0.875rem;
      }

      .modal-footer {
        display: flex;
        justify-content: flex-end;
        gap: 1rem;
        padding: 1.5rem;
        border-top: 1px solid #e2e8f0;
      }

      .btn-primary,
      .btn-secondary {
        padding: 0.75rem 1.5rem;
        border: none;
        border-radius: 0.5rem;
        font-weight: 600;
        font-size: 0.875rem;
        cursor: pointer;
        transition: all 0.2s ease;
      }

      .btn-primary {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
      }

      .btn-primary:hover:not(:disabled) {
        transform: translateY(-1px);
        box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
      }

      .btn-primary:disabled {
        opacity: 0.6;
        cursor: not-allowed;
        transform: none;
      }

      .btn-secondary {
        background: #e2e8f0;
        color: #2d3748;
      }

      .btn-secondary:hover:not(:disabled) {
        background: #cbd5e0;
      }

      .btn-secondary:disabled {
        opacity: 0.6;
        cursor: not-allowed;
      }

      @media (max-width: 640px) {
        .modal-content {
          width: 95%;
          max-width: none;
          margin: 1rem;
        }

        .modal-header {
          padding: 1.25rem;
        }

        .modal-header h2 {
          font-size: 1.25rem;
        }

        .modal-body {
          padding: 1.25rem;
        }

        .modal-footer {
          padding: 1.25rem;
          flex-direction: column;
        }

        .btn-primary,
        .btn-secondary {
          width: 100%;
        }

        .status-select {
          padding: 0.875rem;
          font-size: 16px; /* Previene lo zoom su iOS */
        }
      }
    `,
  ],
})
export class VehicleStatusModalComponent {
  @Input() vehicle!: IVehicle;
  @Output() statusChanged = new EventEmitter<IVehicle>();
  @Output() closeModal = new EventEmitter<void>();

  private vehicleService = inject(VehicleService);

  selectedStatus: string = '';
  isSaving = signal(false);
  error = signal<string | null>(null);

  ngOnInit() {
    this.selectedStatus = this.vehicle.status;
    console.log('[VehicleStatusModal] Initialized with vehicle:', {
      vehicleId: this.vehicle.id,
      brand: this.vehicle.brand,
      model: this.vehicle.model,
      currentStatus: this.vehicle.status,
    });
  }

  onOverlayClick(event: MouseEvent) {
    if (event.target === event.currentTarget) {
      this.close();
    }
  }

  close() {
    if (!this.isSaving()) {
      this.closeModal.emit();
    }
  }

  updateStatus() {
    if (this.selectedStatus === this.vehicle.status || this.isSaving()) {
      return;
    }

    this.isSaving.set(true);
    this.error.set(null);

    console.log('[VehicleStatusModal] Updating status:', {
      vehicleId: this.vehicle.id,
      oldStatus: this.vehicle.status,
      newStatus: this.selectedStatus,
    });

    this.vehicleService.updateVehicleStatus(this.vehicle.id, this.selectedStatus).subscribe({
      next: (updatedVehicle) => {
        console.log('[VehicleStatusModal] Status updated successfully:', updatedVehicle);
        this.isSaving.set(false);
        this.vehicle = { ...this.vehicle, status: this.selectedStatus };
        this.statusChanged.emit(this.vehicle);
        this.close();
      },
      error: (err) => {
        console.error('[VehicleStatusModal] Error updating status:', err);
        this.isSaving.set(false);

        let errorMessage = 'Failed to update status. ';

        if (err.error?.message) {
          errorMessage += err.error.message;
        } else if (err.error?.errors) {
          const errors = Object.values(err.error.errors).flat();
          errorMessage += errors.join(', ');
        } else if (err.statusText) {
          errorMessage += err.statusText;
        } else {
          errorMessage += 'Please try again.';
        }

        this.error.set(errorMessage);
      },
    });
  }
}
