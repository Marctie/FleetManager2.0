import { Component, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

interface IMenuItem {
  path: string;
  label: string;
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  template: `
    <aside class="sidebar" [class.collapsed]="isCollapsed()">
      <!-- Toggle Button -->
      <button class="toggle-btn" (click)="toggleSidebar()">
        <span class="toggle-icon">{{ isCollapsed() ? '→' : '←' }}</span>
      </button>

      <!-- Logo Section -->
      <div class="sidebar-header">
        <div class="logo">
          <img
            src="https://img.icons8.com/?size=100&id=gyxi94qFz5rS&format=png&color=000000"
            alt="Fleet Logo"
          />
        </div>
        @if (!isCollapsed()) {
        <h2 class="logo-text">FleetManagement</h2>
        }
      </div>

      <!-- Navigation Menu -->
      <nav class="sidebar-nav">
        @for (item of menuItems; track item.path) {
        <a [routerLink]="item.path" routerLinkActive="active" class="nav-item" [title]="item.label">
          @if (!isCollapsed()) {
          <span class="nav-label">{{ item.label }}</span>
          }
        </a>
        }
      </nav>
    </aside>
  `,
  styles: [
    `
      .sidebar {
        position: fixed;
        left: 0;
        top: 0;
        height: 100vh;
        background: white;
        box-shadow: 2px 0 10px rgba(0, 0, 0, 0.1);
        display: flex;
        flex-direction: column;
        width: 260px;
        transition: width 0.3s ease;
        z-index: 1000;
      }

      .sidebar.collapsed {
        width: 80px;
      }

      /* Toggle Button */
      .toggle-btn {
        position: absolute;
        top: 1rem;
        right: -15px;
        width: 30px;
        height: 30px;
        border-radius: 50%;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        border: none;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 2px 8px rgba(102, 126, 234, 0.3);
        transition: all 0.3s ease;
        z-index: 10;
      }

      .toggle-btn:hover {
        transform: scale(1.1);
        box-shadow: 0 4px 12px rgba(102, 126, 234, 0.5);
      }

      .toggle-icon {
        font-size: 1rem;
        font-weight: bold;
      }

      /* Header */
      .sidebar-header {
        padding: 2rem 1.5rem;
        display: flex;
        align-items: center;
        gap: 1rem;
        border-bottom: 1px solid #e2e8f0;
      }

      .logo {
        width: 40px;
        height: 40px;
        flex-shrink: 0;
      }

      .logo img {
        width: 100%;
        height: 100%;
        object-fit: contain;
      }

      .logo-text {
        font-size: 1.25rem;
        font-weight: 700;
        color: #2d3748;
        margin: 0;
        white-space: nowrap;
        overflow: hidden;
      }

      .collapsed .logo-text {
        display: none;
      }

      /* Navigation */
      .sidebar-nav {
        flex: 1;
        padding: 1rem 0;
        overflow-y: auto;
        overflow-x: hidden;
      }

      .nav-item {
        display: flex;
        align-items: center;
        gap: 1rem;
        padding: 0.875rem 1.5rem;
        color: #718096;
        text-decoration: none;
        transition: all 0.3s ease;
        position: relative;
      }

      .collapsed .nav-item {
        justify-content: center;
        padding: 0.875rem 0;
      }

      .nav-item:hover {
        background: #f7fafc;
        color: #667eea;
      }

      .nav-item.active {
        background: linear-gradient(
          90deg,
          rgba(102, 126, 234, 0.1) 0%,
          rgba(118, 75, 162, 0.05) 100%
        );
        color: #667eea;
        font-weight: 600;
      }

      .nav-item.active::before {
        content: '';
        position: absolute;
        left: 0;
        top: 0;
        bottom: 0;
        width: 4px;
        background: linear-gradient(180deg, #667eea 0%, #764ba2 100%);
      }

      .nav-icon {
        font-size: 1.5rem;
        flex-shrink: 0;
        width: 24px;
        text-align: center;
      }

      .nav-label {
        white-space: nowrap;
        overflow: hidden;
      }

      /* Scrollbar */
      .sidebar-nav::-webkit-scrollbar {
        width: 6px;
      }

      .sidebar-nav::-webkit-scrollbar-track {
        background: transparent;
      }

      .sidebar-nav::-webkit-scrollbar-thumb {
        background: #cbd5e0;
        border-radius: 3px;
      }

      .sidebar-nav::-webkit-scrollbar-thumb:hover {
        background: #a0aec0;
      }

      /* Responsive */
      @media (max-width: 768px) {
        .sidebar {
          transform: translateX(-100%);
        }

        .sidebar.open {
          transform: translateX(0);
        }
      }
    `,
  ],
})
export class SidebarComponent {
  isCollapsed = signal(false);

  menuItems: IMenuItem[] = [
    { path: '/home', label: 'Home' },
    { path: '/dashboard', label: 'Dashboard' },
    { path: '/vehicle-list', label: 'Vehicles' },
    { path: '/general-map', label: 'Map' },
    { path: '/vehicle-form', label: 'Vehicle Form' },
    { path: '/user-management', label: 'Users' },
    { path: '/associations', label: 'Associations' },
    { path: '/reports', label: 'Reports' },
    { path: '/documents', label: 'Documents' },
  ];

  toggleSidebar() {
    this.isCollapsed.update((value) => !value);
  }
}
