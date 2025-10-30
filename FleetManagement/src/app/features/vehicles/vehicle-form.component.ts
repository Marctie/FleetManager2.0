import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MainLayoutComponent } from '../../shared/main-layout.component';
import { IVehicleForm } from '../../models/IVehicleForm';
import { VehicleService } from '../../services/vehicle.service';

@Component({
  selector: 'app-vehicle-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MainLayoutComponent],
  template: `
    <app-main-layout>
      <div class="page-container">
        <header class="page-header">
          <h1>Vehicle Form</h1>
          <button class="btn-back" (click)="goBack()">Back</button>
        </header>
        <main class="page-content">
          <div class="form-card">
            <h2>Create Vehicle</h2>
            <form [formGroup]="vehicleForm" (ngSubmit)="onSubmit()">
              <div class="form-row">
                <div class="form-group">
                  <label>Brand</label>
                  <input type="text" placeholder="Ford" formControlName="brand" />
                  @if (vehicleForm.get('brand')?.touched && vehicleForm.get('brand')?.invalid) {
                  <div class="error-message">{{ getErrorMessage('brand') }}</div>
                  }
                </div>
                <div class="form-group">
                  <label>Model</label>
                  <input type="text" placeholder="Transit" formControlName="model" />
                  @if (vehicleForm.get('model')?.touched && vehicleForm.get('model')?.invalid) {
                  <div class="error-message">{{ getErrorMessage('model') }}</div>
                  }
                </div>
              </div>

              <div class="form-row">
                <div class="form-group">
                  <label>License Plate</label>
                  <input type="text" placeholder="AB123CD" formControlName="plate" />
                  @if (vehicleForm.get('plate')?.touched && vehicleForm.get('plate')?.invalid) {
                  <div class="error-message">{{ getErrorMessage('plate') }}</div>
                  }
                </div>
                <div class="form-group">
                  <label>VIN</label>
                  <input type="text" placeholder="1HGCM82633A123456" formControlName="vin" />
                  @if (vehicleForm.get('vin')?.touched && vehicleForm.get('vin')?.invalid) {
                  <div class="error-message">{{ getErrorMessage('vin') }}</div>
                  }
                </div>
              </div>

              <div class="form-row">
                <div class="form-group">
                  <label>Year</label>
                  <input type="number" [placeholder]="currentYear" formControlName="year" />
                  @if (vehicleForm.get('year')?.touched && vehicleForm.get('year')?.invalid) {
                  <div class="error-message">{{ getErrorMessage('year') }}</div>
                  }
                </div>
                <div class="form-group">
                  <label>Current Kilometers</label>
                  <input type="number" placeholder="0" formControlName="currentKm" />
                  @if (vehicleForm.get('currentKm')?.touched &&
                  vehicleForm.get('currentKm')?.invalid) {
                  <div class="error-message">{{ getErrorMessage('currentKm') }}</div>
                  }
                </div>
              </div>

              <div class="form-row">
                <div class="form-group">
                  <label>Fuel Type</label>
                  <select formControlName="fuelType">
                    <option [value]="fuelTypes.gasoline">Gasoline</option>
                    <option [value]="fuelTypes.diesel">Diesel</option>
                    <option [value]="fuelTypes.electric">Electric</option>
                    <option [value]="fuelTypes.hybrid">Hybrid</option>
                    <option [value]="fuelTypes.lpg">LPG</option>
                    <option [value]="fuelTypes.cng">CNG</option>
                  </select>
                  @if (vehicleForm.get('fuelType')?.touched && vehicleForm.get('fuelType')?.invalid)
                  {
                  <div class="error-message">{{ getErrorMessage('fuelType') }}</div>
                  }
                </div>
                <div class="form-group">
                  <label>Current Kilometers</label>
                  <input type="number" placeholder="0" formControlName="currentKm" />
                  @if (vehicleForm.get('currentKm')?.touched &&
                  vehicleForm.get('currentKm')?.invalid) {
                  <div class="error-message">{{ getErrorMessage('currentKm') }}</div>
                  }
                </div>
              </div>

              <div class="form-row">
                <div class="form-group">
                  <label>Last Maintenance Date</label>
                  <input type="date" formControlName="lastMaintenanceDate" />
                </div>
                <div class="form-group">
                  <label>Insurance Expiry Date</label>
                  <input type="date" formControlName="insuranceExpiryDate" />
                </div>
              </div>

              <div class="form-actions">
                <button
                  type="submit"
                  class="btn-submit"
                  [disabled]="vehicleForm.invalid || isSubmitting"
                >
                  {{ isSubmitting ? 'Saving...' : 'Save Vehicle' }}
                </button>
                <button
                  type="button"
                  class="btn-cancel"
                  (click)="goBack()"
                  [disabled]="isSubmitting"
                >
                  Cancel
                </button>
              </div>
            </form>
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
        max-width: 900px;
        margin: 0 auto;
      }

      .form-card {
        background: white;
        border-radius: 1rem;
        padding: 2rem;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      }

      .form-card h2 {
        font-size: 1.5rem;
        color: #2d3748;
        margin-bottom: 2rem;
      }

      .form-row {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 1.5rem;
        margin-bottom: 1.5rem;
      }

      .form-group {
        display: flex;
        flex-direction: column;
      }

      .form-group label {
        font-size: 0.875rem;
        font-weight: 600;
        color: #4a5568;
        margin-bottom: 0.5rem;
      }

      .form-group input,
      .form-group select {
        padding: 0.75rem;
        border: 1px solid #e2e8f0;
        border-radius: 0.5rem;
        font-size: 1rem;
        transition: border-color 0.3s ease;
      }

      .form-group input:focus,
      .form-group select:focus {
        outline: none;
        border-color: #667eea;
      }

      .form-actions {
        display: flex;
        gap: 1rem;
        margin-top: 2rem;
        padding-top: 2rem;
        border-top: 2px solid #e2e8f0;
      }

      .btn-submit,
      .btn-cancel {
        padding: 0.75rem 2rem;
        border: none;
        border-radius: 0.5rem;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.3s ease;
        font-size: 1rem;
      }

      .btn-submit {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
      }

      .btn-submit:hover {
        transform: translateY(-2px);
        box-shadow: 0 5px 15px rgba(102, 126, 234, 0.3);
      }

      .btn-cancel {
        background: #e2e8f0;
        color: #2d3748;
      }

      .btn-cancel:hover {
        background: #cbd5e0;
      }

      .error-message {
        color: #e53e3e;
        font-size: 0.875rem;
        margin-top: 0.5rem;
      }

      .form-group input.ng-invalid.ng-touched,
      .form-group select.ng-invalid.ng-touched {
        border-color: #e53e3e;
      }

      .btn-submit:disabled {
        background: #a0aec0;
        cursor: not-allowed;
        transform: none !important;
        box-shadow: none !important;
      }

      @media (max-width: 768px) {
        .form-row {
          grid-template-columns: 1fr;
        }

        .form-actions {
          flex-direction: column;
        }
      }
    `,
  ],
})
export class VehicleFormComponent {
  private router = inject(Router);
  private fb = inject(FormBuilder);
  private vehicleService = inject(VehicleService);
  isSubmitting = false; // Flag per gestire lo stato di invio del form

  currentDate = new Date();
  currentYear = this.currentDate.getFullYear();

  // Enum per i tipi di carburante come definito in config.json
  fuelTypes = {
    gasoline: 0,
    diesel: 1,
    electric: 2,
    hybrid: 3,
    lpg: 4,
    cng: 5,
  };

  vehicleForm = this.fb.group({
    model: ['', [Validators.required]],
    brand: ['', [Validators.required]],
    plate: ['', [Validators.required, Validators.pattern(/^[A-Z]{2}\d{3}[A-Z]{2}$/)]],
    year: [
      this.currentYear,
      [Validators.required, Validators.min(1900), Validators.max(this.currentYear)],
    ],
    fuelType: [0, [Validators.required]], // Impostiamo il valore numerico dell'enum
    currentKm: [0, [Validators.required, Validators.min(0)]],
    vin: ['', [Validators.required, Validators.minLength(17), Validators.maxLength(17)]],
    lastMaintenanceDate: [new Date()],
    insuranceExpiryDate: [new Date(new Date().setFullYear(new Date().getFullYear() + 1))],
  });

  getErrorMessage(controlName: string): string {
    const control = this.vehicleForm.get(controlName);
    if (control?.errors && control.touched) {
      if (control.errors['required']) return 'Campo obbligatorio';
      if (control.errors['min']) return `Valore minimo: ${control.errors['min'].min}`;
      if (control.errors['max']) return `Valore massimo: ${control.errors['max'].max}`;
      if (control.errors['pattern'] && controlName === 'plate')
        return 'Formato targa non valido (es. AB123CD)';
    }
    return '';
  }

  onSubmit() {
    if (this.vehicleForm.valid && !this.isSubmitting) {
      this.isSubmitting = true;

      const formValue = this.vehicleForm.value;

      // Prepariamo i dati del veicolo nel formato esatto richiesto dall'API
      const vehicleData = {
        model: formValue.model || '',
        brand: formValue.brand || '',
        licensePlate: formValue.plate || '',
        year: formValue.year || this.currentYear,
        vin: formValue.vin || '',
        fuelType: Number(formValue.fuelType) || 0,
        currentKm: formValue.currentKm || 0,
        lastMaintenanceDate: formValue.lastMaintenanceDate || new Date(),
        insuranceExpiryDate:
          formValue.insuranceExpiryDate ||
          new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
      };

      this.vehicleService.createVehicle(vehicleData).subscribe({
        next: (createdVehicle) => {
          console.log('Veicolo creato con successo:', createdVehicle);
          this.isSubmitting = false;
          // Mostriamo un messaggio di successo (puoi implementare un servizio di notifiche)
          alert('Veicolo creato con successo!');
          // Torniamo alla lista dei veicoli
          this.router.navigate(['/vehicle-list']);
        },
        error: (error) => {
          console.error('Errore durante la creazione del veicolo:', error);
          this.isSubmitting = false;
          // Mostriamo un messaggio di errore
          alert('Errore durante la creazione del veicolo. Riprova più tardi.');
        },
      });
    } else {
      // Se il form non è valido, mostriamo tutti gli errori
      Object.keys(this.vehicleForm.controls).forEach((key) => {
        const control = this.vehicleForm.get(key);
        if (control?.invalid) {
          control.markAsTouched();
        }
      });
    }
  }

  goBack() {
    this.router.navigate(['/vehicle-list']);
  }
}
