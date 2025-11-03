import { Component, EventEmitter, Input, Output, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { IUser } from '../models/IUser';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-user-form-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="modal-overlay" (click)="onOverlayClick($event)">
      <div class="modal-container" (click)="$event.stopPropagation()">
        <div class="modal-header">
          <h2>{{ isEditMode ? 'Edit User' : 'Create New User' }}</h2>
          <button class="btn-close" (click)="close()">&times;</button>
        </div>

        <form [formGroup]="userForm" (ngSubmit)="onSubmit()" class="modal-body">
          <div class="form-section">
            <h3 class="section-title">Account Information</h3>
            <div class="form-grid">
              <div class="form-field" [class.has-error]="isFieldInvalid('username')">
                <label class="form-label">
                  Username
                  <span class="required">*</span>
                </label>
                <input
                  type="text"
                  formControlName="username"
                  class="form-input"
                  placeholder="Enter username"
                />
                @if (isFieldInvalid('username')) {
                <div class="error-message">Username is required</div>
                }
              </div>

              <div class="form-field" [class.has-error]="isFieldInvalid('email')">
                <label class="form-label">
                  Email
                  <span class="required">*</span>
                </label>
                <input
                  type="email"
                  formControlName="email"
                  class="form-input"
                  placeholder="user@example.com"
                />
                @if (isFieldInvalid('email')) {
                <div class="error-message">
                  {{ getEmailError() }}
                </div>
                }
              </div>

              @if (!isEditMode) {
              <div class="form-field" [class.has-error]="isFieldInvalid('password')">
                <label class="form-label">
                  Password
                  <span class="required">*</span>
                </label>
                <input
                  type="password"
                  formControlName="password"
                  class="form-input"
                  placeholder="Enter password"
                />
                @if (isFieldInvalid('password')) {
                <div class="error-message">Password must be at least 6 characters</div>
                }
              </div>
              }
            </div>
          </div>

          <div class="form-section">
            <h3 class="section-title">Role & Status</h3>
            <div class="form-grid">
              <div class="form-field" [class.has-error]="isFieldInvalid('role')">
                <label class="form-label">
                  Role
                  <span class="required">*</span>
                </label>
                <select formControlName="role" class="form-select">
                  <option value="">Select role</option>
                  <option value="0">Admin</option>
                  <option value="1">Manager</option>
                  <option value="2">Driver</option>
                  <option value="3">Viewer</option>
                </select>
                @if (isFieldInvalid('role')) {
                <div class="error-message">Role is required</div>
                }
              </div>

              <!-- <div class="form-field">
                <label class="form-label">Status</label>
                <div class="toggle-container">
                  <label class="toggle-switch">
                    <input type="checkbox" formControlName="isActive" />
                    <span class="toggle-slider"></span>
                  </label>
                  <span class="toggle-label">
                    {{ userForm.get('isActive')?.value ? 'Active' : 'Inactive' }}
                  </span>
                </div>
              </div> -->
            </div>
          </div>

          @if (error()) {
          <div class="form-error">{{ error() }}</div>
          }

          <div class="modal-footer">
            <button type="submit" class="btn-primary" [disabled]="userForm.invalid || isSaving()">
              {{ isSaving() ? 'Saving...' : isEditMode ? 'Update User' : 'Create User' }}
            </button>
            <button type="button" class="btn-secondary" (click)="close()" [disabled]="isSaving()">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  `,
  styles: [
    `
      .modal-overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.6);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 2000;
        animation: fadeIn 0.3s ease;
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
        max-height: 90vh;
        overflow-y: auto;
        box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
        animation: slideUp 0.3s ease;
      }

      @keyframes slideUp {
        from {
          opacity: 0;
          transform: translateY(20px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }

      .modal-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 1.5rem 2rem;
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
        padding: 2rem;
      }

      .form-section {
        margin-bottom: 2rem;
      }

      .section-title {
        font-size: 1.125rem;
        font-weight: 700;
        color: #2d3748;
        margin-bottom: 1rem;
        padding-bottom: 0.5rem;
        border-bottom: 2px solid #e2e8f0;
      }

      .form-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: 1.25rem;
      }

      .form-field {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
        transition: all 0.3s ease;
      }

      .form-field.has-error {
        animation: shake 0.4s ease;
      }

      @keyframes shake {
        0%,
        100% {
          transform: translateX(0);
        }
        25% {
          transform: translateX(-5px);
        }
        75% {
          transform: translateX(5px);
        }
      }

      .form-label {
        font-size: 0.875rem;
        font-weight: 600;
        color: #4a5568;
      }

      .required {
        color: #e53e3e;
        font-weight: 700;
      }

      .form-input,
      .form-select {
        width: 100%;
        padding: 0.75rem;
        border: 2px solid #e2e8f0;
        border-radius: 0.5rem;
        font-size: 1rem;
        color: #2d3748;
        transition: all 0.3s ease;
      }

      .form-input:focus,
      .form-select:focus {
        outline: none;
        border-color: #667eea;
        box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
      }

      .form-input::placeholder {
        color: #a0aec0;
      }

      .form-input.ng-invalid.ng-touched,
      .form-select.ng-invalid.ng-touched {
        border-color: #fc8181;
        background-color: #fff5f5;
      }

      .error-message {
        color: #e53e3e;
        font-size: 0.813rem;
        font-weight: 500;
        padding: 0.5rem 0.75rem;
        background: #fff5f5;
        border-left: 3px solid #e53e3e;
        border-radius: 0.375rem;
        animation: slideIn 0.3s ease;
      }

      @keyframes slideIn {
        from {
          opacity: 0;
          transform: translateY(-10px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }

      .form-error {
        margin-top: 1rem;
        padding: 1rem;
        background: #fed7d7;
        color: #742a2a;
        border-radius: 0.5rem;
        font-weight: 500;
      }

      .toggle-container {
        display: flex;
        align-items: center;
        gap: 1rem;
        padding: 0.5rem 0;
      }

      .toggle-switch {
        position: relative;
        display: inline-block;
        width: 50px;
        height: 26px;
      }

      .toggle-switch input {
        opacity: 0;
        width: 0;
        height: 0;
      }

      .toggle-slider {
        position: absolute;
        cursor: pointer;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: #cbd5e0;
        transition: 0.4s;
        border-radius: 34px;
      }

      .toggle-slider:before {
        position: absolute;
        content: '';
        height: 20px;
        width: 20px;
        left: 3px;
        bottom: 3px;
        background-color: white;
        transition: 0.4s;
        border-radius: 50%;
      }

      input:checked + .toggle-slider {
        background-color: #48bb78;
      }

      input:checked + .toggle-slider:before {
        transform: translateX(24px);
      }

      .toggle-label {
        font-size: 0.875rem;
        font-weight: 600;
        color: #4a5568;
      }

      .modal-footer {
        display: flex;
        gap: 1rem;
        padding-top: 1.5rem;
        border-top: 2px solid #e2e8f0;
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
        flex: 1;
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
        transform: none;
      }

      .btn-secondary {
        background: #e2e8f0;
        color: #2d3748;
      }

      .btn-secondary:hover:not(:disabled) {
        background: #cbd5e0;
      }

      @media (max-width: 768px) {
        .modal-container {
          width: 100%;
          max-height: 100vh;
          border-radius: 0;
        }

        .modal-header,
        .modal-body {
          padding: 1.25rem;
        }

        .form-grid {
          grid-template-columns: 1fr;
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
export class UserFormModalComponent implements OnInit {
  @Input() user?: IUser;
  @Output() closeModal = new EventEmitter<void>();
  @Output() userSaved = new EventEmitter<IUser>();

  private fb = inject(FormBuilder);
  private userService = inject(UserService);

  userForm!: FormGroup;
  isSaving = signal(false);
  error = signal<string | null>(null);
  isEditMode = false;

  // Mappatura ruoli stringa -> numero
  private roleToNumber: { [key: string]: number } = {
    Admin: 0,
    Manager: 1,
    Driver: 2,
    Viewer: 3,
  };

  ngOnInit() {
    this.isEditMode = !!this.user;
    this.initForm();
  }

  private initForm() {
    if (this.isEditMode && this.user) {
      // Edit mode - converti il role da stringa a numero
      const roleValue = this.roleToNumber[this.user.role] ?? 0;

      this.userForm = this.fb.group({
        username: [this.user.username, [Validators.required]],
        email: [this.user.email, [Validators.required, Validators.email]],
        fullName: [this.user.fullName || ''],
        role: [roleValue.toString(), [Validators.required]], // Converti in stringa per il select
        isActive: [this.user.isActive],
      });
    } else {
      // Create mode
      this.userForm = this.fb.group({
        username: ['', [Validators.required]],
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(6)]],
        fullName: [''],
        role: ['', [Validators.required]],
        isActive: [true],
      });
    }
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.userForm.get(fieldName);
    return !!(field && field.invalid && field.touched);
  }

  getEmailError(): string {
    const emailControl = this.userForm.get('email');
    if (emailControl?.hasError('required')) {
      return 'Email is required';
    }
    if (emailControl?.hasError('email')) {
      return 'Invalid email format';
    }
    return '';
  }

  onSubmit() {
    if (this.userForm.valid && !this.isSaving()) {
      this.isSaving.set(true);
      this.error.set(null);

      const formValue = this.userForm.value;

      if (this.isEditMode && this.user) {
        // Update existing user - prepara i dati per l'API
        const updateData = {
          username: formValue.username,
          email: formValue.email,
          role: parseInt(formValue.role), // Converte in numero
          ...(formValue.fullName && { fullName: formValue.fullName }),
        };

        this.userService.updateUser(this.user.id, updateData).subscribe({
          next: (updatedUser) => {
            this.isSaving.set(false);
            this.userSaved.emit(updatedUser);
            this.close();
          },
          error: (error) => {
            console.error('Error updating user:', error);
            this.error.set(error.error?.message || 'Error updating user. Please try again.');
            this.isSaving.set(false);
          },
        });
      } else {
        // Create new user - prepara i dati per l'API
        const createData = {
          username: formValue.username,
          email: formValue.email,
          password: formValue.password,
          role: parseInt(formValue.role), // Converte la stringa in numero
        };

        console.log('Sending user data:', createData);

        this.userService.createUser(createData).subscribe({
          next: (newUser) => {
            this.isSaving.set(false);
            this.userSaved.emit(newUser);
            this.close();
          },
          error: (error) => {
            console.error('Error creating user:', error);
            // Mostra gli errori di validazione specifici se disponibili
            if (error.error?.errors) {
              const errorMessages = Object.values(error.error.errors).flat().join(', ');
              this.error.set(errorMessages as string);
            } else {
              this.error.set(error.error?.message || 'Error creating user. Please try again.');
            }
            this.isSaving.set(false);
          },
        });
      }
    } else {
      // Mark all fields as touched to show validation errors
      Object.keys(this.userForm.controls).forEach((key) => {
        this.userForm.get(key)?.markAsTouched();
      });
    }
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
}
