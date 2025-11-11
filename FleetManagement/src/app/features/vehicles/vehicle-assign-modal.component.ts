import { Component, EventEmitter, Input, OnInit, Output, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IVehicle } from '../../models/IVehicle';
import { IUser } from '../../models/IUser';
import { UserService } from '../../services/user.service';
import { VehicleService } from '../../services/vehicle.service';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-vehicle-assign-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="modal-overlay" (click)="closeModal()">
      <div class="modal-container" (click)="$event.stopPropagation()">
        <div class="modal-header">
          <h2>Assign Vehicle to Driver</h2>
          <button class="btn-close" (click)="closeModal()">&times;</button>
        </div>

        <div class="modal-body">
          <div class="vehicle-info">
            <h3>Vehicle Details</h3>
            <p>
              <strong>{{ vehicle.brand }} {{ vehicle.model }}</strong>
            </p>
            <p class="text-muted">{{ vehicle.licensePlate }}</p>
            @if (vehicle.assignedDriverName) {
            <p class="current-assignment">
              Current Driver: <strong>{{ vehicle.assignedDriverName }}</strong>
            </p>
            } @else {
            <p class="current-assignment">
              Current Status: <span class="text-muted">Not Assigned</span>
            </p>
            }
          </div>

          @if (isLoading()) {
          <div class="loading-state">Loading drivers...</div>
          } @else if (error()) {
          <div class="error-message">{{ error() }}</div>
          } @else {
          <div class="form-group">
            <label for="driver-select" class="form-label">
              Select Driver
              <span class="required">*</span>
              @if (users().length > 0) {
              <span class="user-count">({{ users().length - 1 }} available)</span>
              }
            </label>
            <select
              id="driver-select"
              [(ngModel)]="selectedUserId"
              class="form-select"
              [disabled]="isAssigning()"
            >
              <option value="">-- Select a driver --</option>
              @for(user of users(); track user.id) { @if(user.id !== vehicle.assignedDriverId) {
              <option value="{{ user.id }}">
                {{ user.fullName || user.username }} - {{ user.role }} ({{ user.email }})
              </option>
              } }
            </select>
            @if (!selectedUserId && attemptedSubmit) {

            <div class="error-text">Please select a driver</div>
            }
          </div>

          @if (users().length === 0) {
          <div class="info-message">No users available for assignment.</div>
          } }
        </div>

        <div class="modal-footer">
          <button class="btn-secondary" (click)="closeModal()" [disabled]="isAssigning()">
            Cancel
          </button>
          <button
            class="btn-status"
            (click)="assignVehicle()"
            [disabled]="!selectedUserId || isAssigning()"
          >
            {{ isAssigning() ? 'Assigning...' : 'Assign Vehicle' }}
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
        max-width: 500px;
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
        align-items: center;
        padding: 1.5rem;
        border-bottom: 2px solid #e2e8f0;
      }

      .modal-header h2 {
        font-size: 1.5rem;
        color: #2d3748;
        font-weight: 700;
        margin: 0;
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

      .vehicle-info {
        background: #f7fafc;
        padding: 1rem;
        border-radius: 0.5rem;
        margin-bottom: 1.5rem;
      }

      .vehicle-info h3 {
        font-size: 0.875rem;
        color: #718096;
        margin-bottom: 0.5rem;
        text-transform: uppercase;
        letter-spacing: 0.05em;
      }

      .vehicle-info p {
        margin: 0.25rem 0;
        color: #2d3748;
      }

      .text-muted {
        color: #718096 !important;
      }

      .current-assignment {
        margin-top: 0.75rem;
        padding-top: 0.75rem;
        border-top: 1px solid #e2e8f0;
      }

      .form-group {
        margin-bottom: 1.5rem;
      }

      .form-label {
        display: block;
        font-size: 0.875rem;
        font-weight: 600;
        color: #4a5568;
        margin-bottom: 0.5rem;
      }

      .required {
        color: #e53e3e;
        font-weight: 700;
      }

      .user-count {
        font-weight: 400;
        color: #718096;
        font-size: 0.813rem;
        margin-left: 0.5rem;
      }

      .form-select {
        width: 100%;
        padding: 0.75rem;
        border: 2px solid #e2e8f0;
        border-radius: 0.5rem;
        font-size: 1rem;
        color: #2d3748;
        background: white;
        cursor: pointer;
        transition: all 0.3s ease;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial,
          sans-serif;
      }

      .form-select option {
        padding: 0.5rem;
        color: #2d3748;
      }

      .form-select option:first-child {
        color: #a0aec0;
        font-style: italic;
      }

      .form-select:hover {
        border-color: #cbd5e0;
      }

      .form-select:focus {
        outline: none;
        border-color: #667eea;
        box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
      }

      .form-select:disabled {
        background: #f7fafc;
        cursor: not-allowed;
        opacity: 0.6;
      }

      .error-text {
        color: #e53e3e;
        font-size: 0.813rem;
        font-weight: 500;
        margin-top: 0.5rem;
        padding: 0.5rem 0.75rem;
        background: #fff5f5;
        border-left: 3px solid #e53e3e;
        border-radius: 0.375rem;
      }

      .loading-state {
        text-align: center;
        padding: 2rem;
        color: #718096;
      }

      .error-message {
        background: #fff5f5;
        border: 1px solid #fc8181;
        border-radius: 0.5rem;
        padding: 1rem;
        color: #c53030;
        margin-bottom: 1rem;
      }

      .info-message {
        background: #ebf8ff;
        border: 1px solid #90cdf4;
        border-radius: 0.5rem;
        padding: 1rem;
        color: #2c5282;
        margin-top: 1rem;
      }

      .modal-footer {
        display: flex;
        gap: 1rem;
        padding: 1.5rem;
        border-top: 2px solid #e2e8f0;
        justify-content: flex-end;
      }

      .btn-primary,
      .btn-secondary {
        padding: 0.75rem 1.5rem;
        border: none;
        border-radius: 0.5rem;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.3s ease;
        font-size: 1rem;
      }

      .btn-primary {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
      }

      .btn-primary:hover:not(:disabled) {
        transform: translateY(-2px);
        box-shadow: 0 5px 15px rgba(102, 126, 234, 0.3);
      }

      .btn-primary:disabled {
        opacity: 0.6;
        cursor: not-allowed;
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

      @media (max-width: 768px) {
        .modal-container {
          width: 95%;
          max-height: 90vh;
        }

        .modal-header,
        .modal-body,
        .modal-footer {
          padding: 1rem;
        }

        .modal-header h2 {
          font-size: 1.25rem;
        }

        .modal-footer {
          flex-direction: column;
        }

        .btn-primary,
        .btn-secondary {
          width: 100%;
        }
      }
    `,
  ],
})
export class VehicleAssignModalComponent implements OnInit {
  @Input() vehicle!: IVehicle;
  @Output() closeModalEvent = new EventEmitter<void>();
  @Output() assignmentSuccess = new EventEmitter<IVehicle>();

  private userService = inject(UserService);
  private vehicleService = inject(VehicleService);
  private notificationService = inject(NotificationService);

  users = signal<IUser[]>([]);
  isLoading = signal(false);
  isAssigning = signal(false);
  error = signal<string | null>(null);

  selectedUserId = '';
  attemptedSubmit = false;

  ngOnInit() {
    this.loadUsers();
  }

  loadUsers() {
    this.isLoading.set(true);
    this.error.set(null);

    this.userService.getUsers().subscribe({
      next: (users) => {
        if (!Array.isArray(users)) {
          this.error.set('Invalid data format received from server.');
          this.notificationService.error('Invalid data format received from server.');
          this.isLoading.set(false);
          return;
        }

        console.log('[VehicleAssignModal] All users received:', users.length);
        console.log(
          '[VehicleAssignModal] Roles in users:',
          users.map((u) => ({ username: u.username, role: u.role }))
        );

        const activeUsers = users
          .filter((u) => {
            const isDriver = u.role === 'Driver';
            console.log(
              '[VehicleAssignModal] Filtering user:',
              u.username,
              'role:',
              u.role,
              'isDriver:',
              isDriver
            );
            return isDriver;
          })
          .sort((a, b) => {
            if (a.role !== b.role) {
              return a.role.localeCompare(b.role);
            }
            const nameA = a.fullName || a.username;
            const nameB = b.fullName || b.username;
            return nameA.localeCompare(nameB);
          });

        console.log('[VehicleAssignModal] Filtered drivers:', activeUsers.length);
        this.users.set(activeUsers);
        this.isLoading.set(false);
      },
      error: (error) => {
        console.error('[VehicleAssignModal] Error loading users:', error);
        this.error.set('Failed to load users. Please try again.');
        this.notificationService.error('Failed to load users. Please try again.');
        this.isLoading.set(false);
      },
    });
  }

  assignVehicle() {
    this.attemptedSubmit = true;
    if (!this.selectedUserId) {
      return;
    }
    this.isAssigning.set(true);
    this.error.set(null);

    // Find the selected user's details for the notification
    const selectedUser = this.users().find((u) => u.id === this.selectedUserId);
    const userName = selectedUser
      ? selectedUser.fullName || selectedUser.username
      : 'the selected user';

    this.vehicleService.assignVehicle(this.vehicle.id, this.selectedUserId).subscribe({
      next: (assignmentResponse) => {
        this.notificationService.success(
          `Vehicle ${this.vehicle.brand} ${this.vehicle.model} successfully assigned to ${userName}!`
        );

        const updatedVehicle: IVehicle = {
          ...this.vehicle,
          assignedDriverId: this.selectedUserId,
          assignedDriverName: userName,
        };

        this.assignmentSuccess.emit(updatedVehicle);
        this.closeModal();
      },
      error: (error) => {
        console.error('Error assigning vehicle:', error);

        let errorMessage = 'Failed to assign vehicle. ';

        if (error.error?.message) {
          errorMessage += error.error.message;
        } else if (error.error?.errors) {
          const validationErrors = Object.values(error.error.errors).flat();
          errorMessage += validationErrors.join(', ');
        } else if (error.error?.title) {
          errorMessage += error.error.title;
        } else if (typeof error.error === 'string') {
          errorMessage += error.error;
        } else {
          errorMessage += 'Please try again.';
        }

        this.error.set(errorMessage);
        this.notificationService.error(errorMessage);
        this.isAssigning.set(false);
      },
    });
  }

  closeModal() {
    this.closeModalEvent.emit();
  }
}
