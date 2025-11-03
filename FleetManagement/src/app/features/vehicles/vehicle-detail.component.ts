import { Component, EventEmitter, Input, Output, inject, signal } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { IVehicle } from '../../models/IVehicle';
import { VehicleService } from '../../services/vehicle.service';
import { VehicleStatusModalComponent } from './vehicle-status-modal.component';

@Component({
  selector: 'app-vehicle-detail',
  standalone: true,
  imports: [CommonModule, DatePipe, ReactiveFormsModule, VehicleStatusModalComponent],
  template: `
    <div class="modal-overlay">
      <div class="modal-container">
        <div class="page-container">
          <header class="page-header">
            <h1>Vehicle Details</h1>
            <button class="btn-back" (click)="goBack()">Close</button>
          </header>

          <main class="page-content">
            @if (!vehicle) {
            <div class="loading-state">Loading vehicle details...</div>
            } @else {
            <div class="detail-card">
              <div class="vehicle-header">
                <div class="vehicle-title">
                  <h2>{{ vehicle.brand }} {{ vehicle.model }}</h2>
                  <p>ID: {{ vehicle.id }} | Plate: {{ vehicle.licensePlate }}</p>
                </div>
              </div>
              @if (!isEditing) {
              <div class="detail-grid">
                <div class="detail-item">
                  <label>Brand & Model</label>
                  <p>{{ vehicle.brand }} {{ vehicle.model }}</p>
                </div>
                <div class="detail-item">
                  <label>Year</label>
                  <p>{{ vehicle.year }}</p>
                </div>
                <div class="detail-item">
                  <label>Status</label>
                  <p>
                    <span class="status-badge" [class]="vehicle.status.toLowerCase()">{{
                      vehicle.status
                    }}</span>
                  </p>
                </div>
                <div class="detail-item">
                  <label>Driver</label>
                  <p>{{ vehicle.assignedDriverName || 'Not Assigned' }}</p>
                </div>
                <div class="detail-item">
                  <label>Mileage</label>
                  <p>{{ vehicle.currentKm }} km</p>
                </div>
                <div class="detail-item">
                  <label>Fuel Type</label>
                  <p>
                    {{
                      vehicle.fuelType !== undefined && vehicle.fuelType !== null
                        ? getFuelTypeName(vehicle.fuelType)
                        : 'Not specified'
                    }}
                  </p>
                </div>
                <div class="detail-item">
                  <label>Last Service</label>
                  <p>{{ vehicle.lastMaintenanceDate | date }}</p>
                </div>
                <div class="detail-item">
                  <label>Insurance Expiry</label>
                  <p>{{ vehicle.insuranceExpiryDate | date }}</p>
                </div>
              </div>
              <div class="actions">
                <button class="btn-status" (click)="openStatusModal()">Change Status</button>
                <button class="btn-primary" (click)="startEditing()">Edit Vehicle</button>
                <!-- <button class="btn-secondary">View History</button> -->
                <button class="btn-danger" (click)="deleteVehicle()">Delete</button>
              </div>
              } @else {
              <form [formGroup]="vehicleForm" (ngSubmit)="onSubmit()" class="edit-form">
                <div class="detail-grid">
                  <div class="detail-item">
                    <label>Brand</label>
                    <input type="text" formControlName="brand" />
                    @if (vehicleForm.get('brand')?.touched && vehicleForm.get('brand')?.invalid) {
                    <div class="error-message">Brand is required</div>
                    }
                  </div>
                  <div class="detail-item">
                    <label>Model</label>
                    <input type="text" formControlName="model" />
                    @if (vehicleForm.get('model')?.touched && vehicleForm.get('model')?.invalid) {
                    <div class="error-message">Model is required</div>
                    }
                  </div>
                  <div class="detail-item">
                    <label>Year</label>
                    <input type="number" formControlName="year" />
                    @if (vehicleForm.get('year')?.touched && vehicleForm.get('year')?.invalid) {
                    <div class="error-message">Invalid year</div>
                    }
                  </div>
                  <div class="detail-item">
                    <label>Current Kilometers</label>
                    <input type="number" formControlName="currentKm" />
                    @if (vehicleForm.get('currentKm')?.touched &&
                    vehicleForm.get('currentKm')?.invalid) {
                    <div class="error-message">Invalid mileage</div>
                    }
                  </div>
                  <div class="detail-item">
                    <label>Fuel Type</label>
                    <select formControlName="fuelType">
                      <option value="0">Gasoline</option>
                      <option value="1">Diesel</option>
                      <option value="2">Electric</option>
                      <option value="3">Hybrid</option>
                      <option value="4">LPG</option>
                      <option value="5">CNG</option>
                    </select>
                  </div>
                  <div class="detail-item">
                    <label>Status</label>
                    <select formControlName="status">
                      <option value="Available">Available</option>
                      <option value="In Use">In Use</option>
                      <option value="Maintenance">Maintenance</option>
                      <option value="Out of Service">Out of Service</option>
                    </select>
                  </div>
                  <div class="detail-item">
                    <label>Last Service Date</label>
                    <input type="date" formControlName="lastMaintenanceDate" />
                  </div>
                  <div class="detail-item">
                    <label>Insurance Expiry Date</label>
                    <input type="date" formControlName="insuranceExpiryDate" />
                  </div>
                </div>
                <div class="actions">
                  <button
                    type="submit"
                    class="btn-primary"
                    [disabled]="vehicleForm.invalid || isSaving"
                  >
                    {{ isSaving ? 'Saving...' : 'Save Changes' }}
                  </button>
                  <button type="button" class="btn-secondary" (click)="cancelEditing()">
                    Cancel
                  </button>
                </div>
              </form>
              }
            </div>
            }
          </main>
        </div>
      </div>
    </div>

    <!-- Modale per il cambio stato -->
    @if (showStatusModal()) {
    <app-vehicle-status-modal
      [vehicle]="vehicle"
      (statusChanged)="handleStatusChanged($event)"
      (closeModal)="closeStatusModal()"
    />
    }
  `,
  styles: [
    `
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
        z-index: 1000;
      }

      .modal-container {
        background: white;
        border-radius: 1rem;
        width: 90%;
        max-width: 1000px;
        max-height: 90vh;
        overflow-y: auto;
      }

      .page-container {
        min-height: 50vh;
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

      .edit-form input,
      .edit-form select {
        width: 100%;
        padding: 0.5rem;
        border: 1px solid #e2e8f0;
        border-radius: 0.375rem;
        font-size: 1rem;
        transition: all 0.3s ease;
      }

      .edit-form input:focus,
      .edit-form select:focus {
        outline: none;
        border-color: #667eea;
        box-shadow: 0 0 0 2px rgba(102, 126, 234, 0.2);
      }

      .edit-form .error-message {
        color: #e53e3e;
        font-size: 0.875rem;
        margin-top: 0.25rem;
      }

      .edit-form input.ng-invalid.ng-touched,
      .edit-form select.ng-invalid.ng-touched {
        border-color: #e53e3e;
      }

      @media (max-width: 1024px) {
        .modal-container {
          width: 95%;
          max-height: 95vh;
        }

        .page-container {
          padding: 1.5rem;
        }

        .detail-grid {
          grid-template-columns: repeat(2, 1fr);
          gap: 1rem;
        }

        .vehicle-header {
          flex-direction: column;
          align-items: flex-start;
          gap: 1rem;
        }
      }

      @media (max-width: 768px) {
        .modal-container {
          width: 100%;
          max-height: 100vh;
          border-radius: 0;
        }

        .page-container {
          padding: 1rem;
        }

        .page-header {
          margin-bottom: 1.5rem;
        }

        .page-header h1 {
          font-size: 1.5rem;
        }

        .btn-back {
          padding: 0.6rem 1.2rem;
          font-size: 0.875rem;
        }

        .detail-grid {
          grid-template-columns: 1fr;
          gap: 1rem;
        }

        .detail-item label {
          font-size: 0.8rem;
        }

        .detail-item p {
          font-size: 0.9rem;
        }

        .actions {
          flex-direction: column;
          gap: 0.75rem;
        }

        .btn-primary,
        .btn-secondary,
        .btn-danger {
          width: 100%;
          padding: 0.875rem 1rem;
        }

        .edit-form input,
        .edit-form select {
          padding: 0.75rem;
          font-size: 16px; /* Previene lo zoom su iOS */
        }
      }

      @media (max-width: 480px) {
        .page-container {
          padding: 0.75rem;
        }

        .page-header {
          margin-bottom: 1rem;
        }

        .page-header h1 {
          font-size: 1.25rem;
        }

        .btn-back {
          padding: 0.5rem 1rem;
          font-size: 0.8rem;
        }

        .vehicle-header {
          padding-bottom: 1rem;
        }

        .vehicle-title h2 {
          font-size: 1.25rem;
        }

        .vehicle-title p {
          font-size: 0.75rem;
        }

        .detail-grid {
          gap: 0.75rem;
        }

        .detail-item {
          padding: 0.5rem 0;
        }

        .status-badge {
          padding: 0.2rem 0.6rem;
          font-size: 0.75rem;
        }

        .actions {
          gap: 0.5rem;
        }

        .btn-primary,
        .btn-secondary,
        .btn-danger {
          padding: 0.75rem 0.875rem;
          font-size: 0.875rem;
        }

        .edit-form input,
        .edit-form select {
          padding: 0.625rem;
        }

        .error-message {
          font-size: 0.75rem;
        }
      }

      @media (max-width: 360px) {
        .page-header h1 {
          font-size: 1.1rem;
        }

        .vehicle-title h2 {
          font-size: 1.1rem;
        }

        .detail-item label {
          font-size: 0.75rem;
        }

        .detail-item p {
          font-size: 0.85rem;
        }
      }
    `,
  ],
})
export class VehicleDetailComponent {
  @Input() vehicle!: IVehicle;
  @Output() closeModal = new EventEmitter<boolean>();
  @Output() vehicleUpdated = new EventEmitter<IVehicle>();

  private fb = inject(FormBuilder);
  private vehicleService = inject(VehicleService);

  isEditing = false;
  isSaving = false;
  currentYear = new Date().getFullYear();
  showStatusModal = signal(false);

  // Mapping dei tipi di carburante
  private fuelTypeMap: { [key: number]: string } = {
    0: 'Gasoline',
    1: 'Diesel',
    2: 'Electric',
    3: 'Hybrid',
    4: 'LPG',
    5: 'CNG',
  };

  getFuelTypeName(fuelType: number | string): string {
    // Se è già una stringa (nome), restituiscila direttamente
    if (typeof fuelType === 'string') {
      return fuelType;
    }
    // Se è un numero, cerca nella mappa
    return this.fuelTypeMap[fuelType] || 'Unknown';
  }

  vehicleForm!: FormGroup;

  startEditing() {
    this.isEditing = true;
    this.initForm();
  }

  cancelEditing() {
    this.isEditing = false;
    this.vehicleForm.reset();
  }

  initForm() {
    // conversione delle date in formato yyyy-MM-dd per l'input type="date"
    const lastMaintenanceDate = this.vehicle.lastMaintenanceDate
      ? new Date(this.vehicle.lastMaintenanceDate).toISOString().split('T')[0]
      : '';
    const insuranceExpiryDate = this.vehicle.insuranceExpiryDate
      ? new Date(this.vehicle.insuranceExpiryDate).toISOString().split('T')[0]
      : '';

    this.vehicleForm = this.fb.group({
      brand: [this.vehicle.brand, [Validators.required]],
      model: [this.vehicle.model, [Validators.required]],
      year: [
        this.vehicle.year,
        [Validators.required, Validators.min(1900), Validators.max(this.currentYear)],
      ],
      currentKm: [this.vehicle.currentKm, [Validators.required, Validators.min(0)]],
      fuelType: [this.vehicle.fuelType, [Validators.required]],
      status: [this.vehicle.status, [Validators.required]],
      lastMaintenanceDate: [lastMaintenanceDate],
      insuranceExpiryDate: [insuranceExpiryDate],
    });
  }

  onSubmit() {
    if (this.vehicleForm.valid && !this.isSaving) {
      this.isSaving = true;
      const formValue = this.vehicleForm.value;

      try {
        // Prepariamo i dati aggiornati mantenendo tutti i campi richiesti
        const updatedVehicle: IVehicle = {
          ...this.vehicle,
          brand: formValue.brand.trim(),
          model: formValue.model.trim(),
          year: parseInt(formValue.year),
          currentKm: parseInt(formValue.currentKm),
          fuelType: parseInt(formValue.fuelType),
          status: formValue.status,
          lastMaintenanceDate: formValue.lastMaintenanceDate
            ? new Date(formValue.lastMaintenanceDate)
            : this.vehicle.lastMaintenanceDate,
          insuranceExpiryDate: formValue.insuranceExpiryDate
            ? new Date(formValue.insuranceExpiryDate)
            : this.vehicle.insuranceExpiryDate,
        };

        this.vehicleService.updateVehicle(updatedVehicle).subscribe({
          next: (result) => {
            // Se l'API non restituisce lo status, usiamo quello che abbiamo inviato
            this.vehicle = {
              ...result,
              status: updatedVehicle.status,
            };

            this.isSaving = false;
            this.isEditing = false;
            this.vehicleUpdated.emit(this.vehicle);
            alert('Vehicle updated successfully!');
          },
          error: (error: any) => {
            this.isSaving = false;
            console.error('Error updating vehicle:', error);
            let errorMessage = 'Error updating vehicle. ';

            if (error.error?.errors) {
              // Se ci sono errori di validazione specifici
              const validationErrors = Object.values(error.error.errors).flat();
              errorMessage += validationErrors.join('\n');
            } else {
              errorMessage += 'Please try again.';
            }

            alert(errorMessage);
          },
        });
      } catch (error) {
        this.isSaving = false;
        console.error('Error preparing vehicle data:', error);
        alert('Error preparing vehicle data. Please check your input.');
      }
    } else {
      // Mostra gli errori di validazione
      Object.keys(this.vehicleForm.controls).forEach((key) => {
        const control = this.vehicleForm.get(key);
        if (control?.invalid) {
          control.markAsTouched();
        }
      });
    }
  }

  deleteVehicle() {
    // Chiediamo conferma prima di eliminare
    if (
      confirm(
        `Are you sure you want to delete the vehicle ${this.vehicle.brand} ${this.vehicle.model} (${this.vehicle.licensePlate})? This action cannot be undone.`
      )
    ) {
      this.vehicleService.deleteVehicle(this.vehicle.id).subscribe({
        next: () => {
          alert('Vehicle deleted successfully!');
          // Emettiamo un evento per notificare la lista che il veicolo è stato eliminato
          this.vehicleUpdated.emit(this.vehicle);
          this.closeModal.emit(true);
        },
        error: (error: any) => {
          console.error('Error deleting vehicle:', error);
          let errorMessage = 'Error deleting vehicle. ';

          if (error.error?.message) {
            errorMessage += error.error.message;
          } else {
            errorMessage += 'Please try again.';
          }

          alert(errorMessage);
        },
      });
    }
  }

  goBack() {
    if (this.isEditing) {
      if (confirm('Are you sure you want to discard your changes?')) {
        this.isEditing = false;
        this.closeModal.emit(true);
      }
    } else {
      this.closeModal.emit(true);
    }
  }

  // Metodi per la modale di cambio stato
  openStatusModal() {
    this.showStatusModal.set(true);
  }

  closeStatusModal() {
    this.showStatusModal.set(false);
  }

  handleStatusChanged(updatedVehicle: IVehicle) {
    // Aggiorna il veicolo locale con il nuovo stato
    this.vehicle = { ...this.vehicle, status: updatedVehicle.status };
    // Notifica il parent component
    this.vehicleUpdated.emit(this.vehicle);
  }
}
