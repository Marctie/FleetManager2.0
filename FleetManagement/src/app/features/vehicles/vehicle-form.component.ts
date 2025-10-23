import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MainLayoutComponent } from '../../shared/main-layout.component';

@Component({
  selector: 'app-vehicle-form',
  standalone: true,
  imports: [CommonModule, FormsModule, MainLayoutComponent],
  template: `
    <app-main-layout>
      <div class="page-container">
        <header class="page-header">
          <h1>Vehicle Form</h1>
          <button class="btn-back" (click)="goBack()">Back to Home</button>
        </header>

        <main class="page-content">
          <div class="form-card">
            <h2>Create / Edit Vehicle</h2>
            <form>
              <div class="form-row">
                <div class="form-group">
                  <label>Vehicle ID</label>
                  <input type="text" placeholder="V001" [(ngModel)]="vehicle.id" name="id" />
                </div>
                <div class="form-group">
                  <label>Model</label>
                  <input
                    type="text"
                    placeholder="Ford Transit"
                    [(ngModel)]="vehicle.model"
                    name="model"
                  />
                </div>
              </div>

              <div class="form-row">
                <div class="form-group">
                  <label>License Plate</label>
                  <input
                    type="text"
                    placeholder="AB123CD"
                    [(ngModel)]="vehicle.plate"
                    name="plate"
                  />
                </div>
                <div class="form-group">
                  <label>Year</label>
                  <input type="number" placeholder="2022" [(ngModel)]="vehicle.year" name="year" />
                </div>
              </div>

              <div class="form-row">
                <div class="form-group">
                  <label>Status</label>
                  <select [(ngModel)]="vehicle.status" name="status">
                    <option value="active">Active</option>
                    <option value="parked">Parked</option>
                    <option value="maintenance">Maintenance</option>
                  </select>
                </div>
                <div class="form-group">
                  <label>Fuel Type</label>
                  <select [(ngModel)]="vehicle.fuelType" name="fuelType">
                    <option value="diesel">Diesel</option>
                    <option value="petrol">Petrol</option>
                    <option value="electric">Electric</option>
                    <option value="hybrid">Hybrid</option>
                  </select>
                </div>
              </div>

              <div class="form-row">
                <div class="form-group">
                  <label>Mileage (km)</label>
                  <input
                    type="number"
                    placeholder="45000"
                    [(ngModel)]="vehicle.mileage"
                    name="mileage"
                  />
                </div>
                <div class="form-group">
                  <label>Driver</label>
                  <input
                    type="text"
                    placeholder="John Doe"
                    [(ngModel)]="vehicle.driver"
                    name="driver"
                  />
                </div>
              </div>

              <div class="form-actions">
                <button type="submit" class="btn-submit">Save Vehicle</button>
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
  vehicle = {
    id: '',
    model: '',
    plate: '',
    year: 2024,
    status: 'active',
    fuelType: 'diesel',
    mileage: 0,
    driver: '',
  };

  constructor(private router: Router) {}

  goBack() {
    this.router.navigate(['/home']);
  }
}
