import { Component, effect, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { SidebarComponent } from './sidebar.component';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [SidebarComponent, NgClass],
  template: `
    <div class="layout-container">
      <!-- Header Full Width -->
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

      <!-- Sidebar -->
      @if (showSidebar()) {
      <app-sidebar></app-sidebar>
      }

      <!-- Sidebar Toggle Button -->
      <button
        class="sidebar-toggle-btn"
        (click)="toggleSidebar()"
        [title]="showSidebar() ? 'Hide Sidebar' : 'Show Sidebar'"
      >
        <span>{{ showSidebar() ? '<' : '>' }}</span>
      </button>

      <!-- Main Content Area -->
      <div class="content-wrapper" [class.full-width]="showSidebar()">
        <main class="layout-content">
          <ng-content></ng-content>
        </main>
      </div>
    </div>
  `,
  styles: [
    `
      .layout-container {
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
        z-index: 1001;
        width: 100%;
      }

      .header-content {
        display: flex;
        justify-content: space-between;
        align-items: center;
        max-width: 100%;
        padding-left: 0;
        transition: padding-left 0.3s ease;
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

      .sidebar-toggle-btn {
        position: fixed;
        left: 20px;
        bottom: 20px;
        width: 50px;
        height: 50px;
        border-radius: 50%;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        border: none;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
        transition: all 0.3s ease;
        z-index: 1002;
        font-size: 1.25rem;
      }

      .sidebar-toggle-btn:hover {
        transform: scale(1.1);
        box-shadow: 0 6px 16px rgba(102, 126, 234, 0.6);
      }

      .content-wrapper {
        flex: 1;
        margin-left: 0px;
        width: 100%;
        display: flex;
        flex-direction: column;
        transition: margin-left 0.3s ease, width 0.3s ease;
      }

      .content-wrapper.full-width {
        margin-left: 260px;

        width: 80%;
      }

      .layout-content {
        flex: 1;
        padding: 2rem;
      }

      @media (max-width: 768px) {
        .header-content {
          padding-left: 0;
          flex-direction: column;
          gap: 1rem;
        }

        .content-wrapper {
          margin-left: 0;
        }

        .layout-content {
          padding: 1rem;
        }

        .user-section {
          width: 100%;
          justify-content: space-between;
        }
      }
    `,
  ],
})
export class MainLayoutComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  currentUser = this.authService.getCurrentUser();
  showSidebar = signal(false);

  toggleSidebar() {
    this.showSidebar.update((value) => !value);
  }

  onLogout() {
    if (confirm('Are you sure you want to logout?')) {
      this.authService.logout().subscribe({
        next: () => {
          this.router.navigate(['/login']);
        },
        error: (error) => {
          console.error('Error during logout:', error);
          this.router.navigate(['/login']);
        },
      });
    }
  }
}
