import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [],
  template: `
    <div class="home-container">
      <header class="header">
        <div class="header-content">
          <div class="logo-section">
            <div class="logo">
              <img
                src="https://img.icons8.com/?size=100&id=gyxi94qFz5rS&format=png&color=000000"
                width="40"
                height="40"
                alt="Fleet Logo"
              />
            </div>
            <h1>FleetManagement</h1>
          </div>
          <div class="user-section">
            @if (currentUser) {
            <div class="user-info">
              <div class="user-details">
                <span class="username">{{ currentUser.username }}</span>
                @if (currentUser.role) {
                <span class="user-role">{{ currentUser.role }}</span>
                }
              </div>
            </div>
            }
            <button class="btn-logout" (click)="onLogout()">Logout</button>
          </div>
        </div>
      </header>

      <main class="main-content">
        <div class="welcome-section">
          <h2>Welcome to Fleet Management System!</h2>
        </div>
        <div class="cards-grid">
          <div class="card" (click)="navigateTo('/dashboard')">
            <div class="card-header">
              <h3>Dashboard</h3>
            </div>
            <p>Overview and statistics</p>
          </div>
          <div class="card" (click)="navigateTo('/vehicle-list')">
            <div class="card-header">
              <h3>Vehicle List</h3>
            </div>
            <p>Browse all vehicles</p>
          </div>

          <!-- <div class="card" (click)="navigateTo('/vehicle-detail')">
            <div class="card-header">
              <h3>Vehicle Details</h3>
            </div>
            <p>Vehicle details (Modal)</p>
          </div> -->

          <!-- <div class="card" (click)="navigateTo('/general-map')">
            <div class="card-header">
              <h3>General Map</h3>
            </div>
            <p>View all vehicles on map</p>
          </div> -->

          <!-- <div class="card" (click)="navigateTo('/vehicle-form')">
            <div class="card-header">
              <h3>Vehicle Form (spostare in lista veicoli )</h3>
            </div>
            <p>Create/Edit vehicles</p>
          </div> -->
          <div class="card" (click)="navigateTo('/user-management')">
            <div class="card-header">
              <h3>User Management</h3>
            </div>
            <p>Manage users</p>
          </div>
          <!-- <div class="card" (click)="navigateTo('/associations')">
            <div class="card-header">
              <h3>Associations Management</h3>
            </div>
            <p>Manage associations</p>
            
          </div> -->
          <div class="card" (click)="navigateTo('/reports')">
            <div class="card-header">
              <h3>Reports and Statistics</h3>
            </div>
            <p>Analytics and reports</p>
          </div>
          <div class="card" (click)="navigateTo('/documents')">
            <div class="card-header">
              <h3>Document Management</h3>
            </div>
            <p>Document management</p>
          </div>
        </div>
      </main>
    </div>
  `,
  styles: [
    `
      .home-container {
        min-height: 100vh;
        display: flex;
        flex-direction: column;
        background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
      }

      .header {
        background: white;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        padding: 1rem 2rem;
        position: sticky;
        top: 0;
        z-index: 100;
        width: 100%;
      }

      .header-content {
        display: flex;
        justify-content: space-between;
        align-items: center;
        max-width: 100%;
      }

      .logo-section {
        display: flex;
        align-items: center;
        gap: 1rem;
      }

      .logo img {
        display: block;
      }

      .header h1 {
        font-size: 1.5rem;
        color: #2d3748;
        font-weight: 700;
        margin: 0;
      }

      .user-section {
        display: flex;
        align-items: center;
        gap: 1rem;
      }

      .user-info {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        padding: 0.5rem 1rem;
        background: #f7fafc;
        border-radius: 0.5rem;
      }

      .user-details {
        display: flex;
        flex-direction: column;
        gap: 0.125rem;
      }

      .username {
        font-weight: 600;
        color: #2d3748;
        font-size: 0.875rem;
        line-height: 1.2;
      }

      .user-role {
        font-size: 0.75rem;
        color: #718096;
        line-height: 1.2;
      }

      .btn-logout {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        padding: 0.625rem 1.25rem;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        border: none;
        border-radius: 0.5rem;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.3s ease;
        font-size: 0.875rem;
      }

      .btn-logout:hover {
        transform: translateY(-2px);
        box-shadow: 0 5px 15px rgba(102, 126, 234, 0.3);
      }

      .main-content {
        flex: 1;
        padding: 2rem;
        max-width: 1400px;
        width: 100%;
        margin: 0 auto;
      }

      .welcome-section {
        text-align: center;
        margin-bottom: 3rem;
        animation: fadeIn 0.6s ease-out;
      }

      .guest-banner {
        background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%);
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 0.75rem;
        margin: 1.5rem auto;
        max-width: 600px;
        box-shadow: 0 4px 12px rgba(251, 191, 36, 0.3);
        animation: slideDown 0.5s ease-out;
      }

      .guest-content strong {
        display: block;
        font-size: 1.125rem;
        margin-bottom: 0.5rem;
      }

      .guest-content p {
        margin: 0;
        font-size: 0.875rem;
        opacity: 0.95;
      }

      @keyframes slideDown {
        from {
          opacity: 0;
          transform: translateY(-20px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }

      @keyframes fadeIn {
        from {
          opacity: 0;
          transform: translateY(-20px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }

      .welcome-section h2 {
        font-size: 2.5rem;
        color: #2d3748;
        margin-bottom: 0.5rem;
        font-weight: 700;
      }

      .subtitle {
        font-size: 1.125rem;
        color: #718096;
      }

      .cards-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
        gap: 1.5rem;
        margin-bottom: 2rem;
      }

      .card {
        background: white;
        border-radius: 1rem;
        padding: 2rem;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        transition: all 0.3s ease;
        cursor: pointer;
        animation: slideUp 0.5s ease-out;
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

      .card:hover {
        transform: translateY(-5px);
        box-shadow: 0 10px 20px rgba(0, 0, 0, 0.15);
      }

      .card-header {
        padding-bottom: 1rem;
        margin-bottom: 1rem;
        border-bottom: 2px solid #e2e8f0;
      }

      .card h3 {
        font-size: 1.25rem;
        color: #2d3748;
        margin-bottom: 0.5rem;
        font-weight: 600;
      }

      .card p {
        color: #718096;
        margin-bottom: 1rem;
        font-size: 0.875rem;
      }

      .card-stats {
        display: flex;
        flex-direction: column;
        gap: 0.25rem;
        padding-top: 1rem;
        margin-top: 1rem;
        border-top: 2px solid #e2e8f0;
      }

      .stat-value {
        font-size: 2.5rem;
        font-weight: 700;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
        line-height: 1;
      }

      .stat-label {
        font-size: 0.875rem;
        color: #718096;
        text-transform: uppercase;
        letter-spacing: 0.05em;
        font-weight: 500;
      }

      .info-section {
        margin-top: 2rem;
      }

      .info-card {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        border-radius: 1rem;
        padding: 2rem;
        box-shadow: 0 10px 30px rgba(102, 126, 234, 0.3);
      }

      .info-card h3 {
        font-size: 1.5rem;
        margin-bottom: 1rem;
      }

      .info-card p {
        margin-bottom: 1rem;
        opacity: 0.95;
      }

      .info-card ul {
        list-style: none;
        padding: 0;
      }

      .info-card li {
        padding: 0.5rem 0;
        font-size: 0.875rem;
        opacity: 0.9;
      }

      @media (max-width: 768px) {
        .header-content {
          flex-direction: column;
          gap: 1rem;
        }

        .main-content {
          padding: 1rem;
        }

        .user-section {
          width: 100%;
          justify-content: space-between;
        }

        .welcome-section h2 {
          font-size: 1.75rem;
        }

        .cards-grid {
          grid-template-columns: 1fr;
        }
      }
    `,
  ],
})
export class HomeComponent implements OnInit, OnDestroy {
  private authService = inject(AuthService);
  private router = inject(Router);
  private subscription?: Subscription;

  currentUser = this.authService.getCurrentUser();
  isGuest = this.authService.isGuestMode();

  ngOnInit() {
    // Component initialization
    console.log(this.currentUser, 'utente', this.currentUser?.role);
  }

  ngOnDestroy() {
    // Clean up subscription
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  navigateTo(route: string) {
    this.router.navigate([route]);
  }

  onLogout() {
    if (confirm('Are you sure you want to logout?')) {
      this.authService.logout().subscribe({
        next: () => {
          console.log('Logout completed');
        },
        error: (error) => {
          console.error('Error during logout:', error);
          this.router.navigate(['/login']);
        },
      });
    }
  }
}
