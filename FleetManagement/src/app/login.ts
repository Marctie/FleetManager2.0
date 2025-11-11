import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="login-container">
      <div class="login-card">
        <div class="login-header">
          <div class="logo">
            <img
              src="https://img.icons8.com/?size=100&id=gyxi94qFz5rS&format=png&color=000000"
              alt="Fleet Management Logo"
              width="100"
              height="100"
              (click)="loginAsGuest()"
              style="cursor: pointer;"
              title="Click to enter as guest"
            />
          </div>
          <h1>FleetManagement</h1>
          <p class="subtitle">Access the system</p>
        </div>

        <form class="login-form" (ngSubmit)="onSubmit()">
          <div class="form-group">
            <label for="username">Username</label>
            <input
              type="text"
              id="username"
              name="username"
              [(ngModel)]="username"
              placeholder="Enter username"
              (focus)="clearError()"
              [disabled]="isLoading"
              required
            />
          </div>

          <div class="form-group">
            <label for="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              [(ngModel)]="password"
              placeholder="Enter password"
              (focus)="clearError()"
              [disabled]="isLoading"
              required
            />
          </div>
          @if(errorMessage){

          <div class="error-message">
            {{ errorMessage }}
          </div>
          }

          <button
            type="submit"
            class="btn-login"
            [disabled]="isLoading"
            [class.loading]="isLoading"
          >
            @if(!isLoading){
            <span>Login</span>
            }@else{
            <span class="spinner">Loading...</span>
            }
          </button>
        </form>
      </div>
    </div>
  `,
  styles: [
    `
      .login-container {
        min-height: 100vh;
        display: flex;
        align-items: center;
        justify-content: center;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        padding: 1rem;
      }

      .login-card {
        background: white;
        border-radius: 1rem;
        box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
        padding: 2.5rem;
        width: 100%;
        max-width: 420px;
        animation: slideUp 0.4s ease-out;
      }

      @keyframes slideUp {
        from {
          opacity: 0;
          transform: translateY(30px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }

      .login-header {
        text-align: center;
        margin-bottom: 2rem;
      }

      .logo {
        font-size: 4rem;
        margin-bottom: 0.5rem;
        animation: bounce 1s infinite;
      }

      @keyframes bounce {
        0%,
        100% {
          transform: translateY(0);
        }
        50% {
          transform: translateY(-10px);
        }
      }

      .login-header h1 {
        color: #2d3748;
        font-size: 1.875rem;
        margin-bottom: 0.5rem;
        font-weight: 700;
      }

      .subtitle {
        color: #718096;
        font-size: 1rem;
      }

      .guest-hint {
        color: #a0aec0;
        font-size: 0.75rem;
        margin-top: 0.5rem;
        font-style: italic;
      }

      .login-form {
        margin-bottom: 1.5rem;
      }

      .form-group {
        margin-bottom: 1.5rem;
      }

      .form-group label {
        display: block;
        margin-bottom: 0.5rem;
        color: #2d3748;
        font-weight: 500;
        font-size: 0.875rem;
      }

      .form-group input {
        width: 100%;
        padding: 0.875rem 1rem;
        border: 2px solid #e2e8f0;
        border-radius: 0.5rem;
        font-size: 1rem;
        transition: all 0.3s ease;
        font-family: inherit;
      }

      .form-group input:focus {
        outline: none;
        border-color: #667eea;
        box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
      }

      .form-group input:disabled {
        background-color: #f7fafc;
        cursor: not-allowed;
      }

      .form-group input::placeholder {
        color: #a0aec0;
      }

      .error-message {
        background-color: #fed7d7;
        color: #c53030;
        padding: 0.875rem 1rem;
        border-radius: 0.5rem;
        margin-bottom: 1rem;
        display: flex;
        align-items: center;
        gap: 0.5rem;
        font-size: 0.875rem;
        animation: shake 0.4s ease-in-out;
      }

      @keyframes shake {
        0%,
        100% {
          transform: translateX(0);
        }
        25% {
          transform: translateX(-10px);
        }
        75% {
          transform: translateX(10px);
        }
      }

      .error-icon {
        font-size: 1.25rem;
      }

      .btn-login {
        width: 100%;
        padding: 1rem;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        border: none;
        border-radius: 0.5rem;
        font-size: 1rem;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.3s ease;
        text-transform: uppercase;
        letter-spacing: 0.05em;
      }

      .btn-login:hover:not(:disabled) {
        transform: translateY(-2px);
        box-shadow: 0 10px 20px rgba(102, 126, 234, 0.3);
      }

      .btn-login:active:not(:disabled) {
        transform: translateY(0);
      }

      .btn-login:disabled {
        opacity: 0.6;
        cursor: not-allowed;
      }

      .btn-login.loading {
        background: linear-gradient(135deg, #a0aec0 0%, #718096 100%);
      }

      .spinner {
        display: inline-flex;
        align-items: center;
        gap: 0.5rem;
      }

      .login-footer {
        text-align: center;
        padding-top: 1.5rem;
        border-top: 1px solid #e2e8f0;
      }

      .test-info {
        background-color: #ebf8ff;
        color: #2c5282;
        padding: 1rem;
        border-radius: 0.5rem;
        font-size: 0.875rem;
        line-height: 1.6;
        border-left: 4px solid #3182ce;
      }

      .test-info strong {
        display: block;
        margin-bottom: 0.5rem;
      }

      .test-info code {
        background-color: #bee3f8;
        padding: 0.2rem 0.4rem;
        border-radius: 0.25rem;
        font-family: 'Courier New', monospace;
        font-size: 0.8rem;
      }

      @media (max-width: 480px) {
        .login-card {
          padding: 2rem 1.5rem;
        }

        .login-header h1 {
          font-size: 1.5rem;
        }

        .logo {
          font-size: 3rem;
        }
      }
    `,
  ],
})
export class LoginComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  username = '';
  password = '';
  errorMessage = '';
  isLoading = false;

  onSubmit() {
    if (!this.username || !this.password) {
      this.errorMessage = 'Please enter username and password';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    this.authService
      .login({
        username: this.username,
        password: this.password,
      })
      .subscribe({
        next: (response) => {
          console.log('Login successful:', response);

          this.router.navigate(['/home']);
        },
        error: (error) => {
          console.error('Login error:', error);

          if (error.status === 401) {
            this.errorMessage =
              error.error?.message || 'Invalid credentials. Please check username and password.';
          } else if (error.status === 0) {
            this.errorMessage = 'Cannot connect to server. Please check your connection.';
          } else if (error.status >= 500) {
            this.errorMessage = 'Server error. Please try again later.';
          } else {
            this.errorMessage = error.error?.message || 'An error occurred. Please try again.';
          }

          this.isLoading = false;
        },
        complete: () => {
          this.isLoading = false;
        },
      });
  }

  clearError() {
    this.errorMessage = '';
  }

  loginAsGuest() {
    console.log('Accesso come ospite...');
    // this.authService.loginAsGuest();
    // this.router.navigate(['/home']);
  }
}
