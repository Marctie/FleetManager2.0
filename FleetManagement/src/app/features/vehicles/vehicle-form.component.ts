import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MainLayoutComponent } from '../../shared/main-layout.component';
import { IVehicleForm } from '../../models/IVehicleForm';

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
                  <label>Vehicle ID</label>
                  <input type="text" placeholder="V001" formControlName="id" />
                  @if (vehicleForm.get('id')?.touched && vehicleForm.get('id')?.invalid) {
                  <div class="error-message">{{ getErrorMessage('id') }}</div>
                  }
                </div>
                <div class="form-group">
                  <label>Model</label>
                  <input type="text" placeholder="Ford Transit" formControlName="model" />
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
                  <label>Year</label>
                  <input type="number" [placeholder]="currentYear" formControlName="year" />
                  @if (vehicleForm.get('year')?.touched && vehicleForm.get('year')?.invalid) {
                  <div class="error-message">{{ getErrorMessage('year') }}</div>
                  }
                </div>
              </div>

              <div class="form-row">
                <div class="form-group">
                  <label>Status</label>
                  <select formControlName="status">
                    <option value="active">Active</option>
                    <option value="parked">Parked</option>
                    <option value="maintenance">Maintenance</option>
                  </select>
                  @if (vehicleForm.get('status')?.touched && vehicleForm.get('status')?.invalid) {
                  <div class="error-message">{{ getErrorMessage('status') }}</div>
                  }
                </div>
                <div class="form-group">
                  <label>Fuel Type</label>
                  <select formControlName="fuelType">
                    <option value="diesel">Diesel</option>
                    <option value="petrol">Petrol</option>
                    <option value="electric">Electric</option>
                    <option value="hybrid">Hybrid</option>
                  </select>
                  @if (vehicleForm.get('fuelType')?.touched && vehicleForm.get('fuelType')?.invalid)
                  {
                  <div class="error-message">{{ getErrorMessage('fuelType') }}</div>
                  }
                </div>
              </div>

              <div class="form-row">
                <div class="form-group">
                  <label>Mileage (km)</label>
                  <input type="number" placeholder="0" formControlName="mileage" />
                  @if (vehicleForm.get('mileage')?.touched && vehicleForm.get('mileage')?.invalid) {
                  <div class="error-message">{{ getErrorMessage('mileage') }}</div>
                  }
                </div>
                <div class="form-group">
                  <label>Driver</label>
                  <input type="text" placeholder="John Doe" formControlName="driver" />
                </div>
              </div>

              <div class="form-actions">
                <button type="submit" class="btn-submit" [disabled]="vehicleForm.invalid">
                  Save Vehicle
                </button>
                <button type="button" class="btn-cancel" (click)="goBack()">Cancel</button>
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

  currentDate = new Date();
  currentYear = this.currentDate.getFullYear();

  vehicleForm = this.fb.group({
    id: ['', [Validators.required]],
    model: ['', [Validators.required]],
    plate: ['', [Validators.required, Validators.pattern(/^[A-Z]{2}\d{3}[A-Z]{2}$/)]],
    year: ['', [Validators.required, Validators.min(1900), Validators.max(this.currentYear)]],
    status: ['active', [Validators.required]],
    fuelType: ['diesel', [Validators.required]],
    mileage: [0, [Validators.required, Validators.min(0)]],
    driver: [''],
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
    if (this.vehicleForm.valid) {
      console.log('Form valido:', this.vehicleForm.value);
      // TODO: Implementare la chiamata al service
    } else {
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
