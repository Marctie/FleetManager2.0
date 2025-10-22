import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-management',
  standalone: true,
  imports: [],
  template: `
    <div class="user-management-wrapper">
      <!-- Animated Background Orbs -->
      <div class="orb orb-1"></div>
      <div class="orb orb-2"></div>
      <div class="orb orb-3"></div>

      <header
        class="header-glass sticky top-0 z-50 backdrop-blur-md bg-white/80 shadow-lg border-b border-white/20 mb-8"
      >
        <div class="max-w-7xl mx-auto px-8 py-4 flex justify-between items-center">
          <h1 class="text-3xl font-extrabold text-gradient">User Management</h1>
          <button (click)="goBack()" class="btn-back group">
            <span>Back to Home</span>
          </button>
        </div>
      </header>

      <main class="max-w-7xl mx-auto px-8 relative z-10">
        <!-- Search Bar with Glass Effect -->
        <div class="search-container glass-card mb-8">
          <div class="relative">
            <input
              type="text"
              placeholder="Search users by name, email or role..."
              class="search-input"
            />
          </div>
          <button class="btn-add">
            <span>Add User</span>
          </button>
        </div>

        <!-- Stats Cards -->
        <div class="stats-grid mb-8">
          <div class="stat-card">
            <div class="stat-icon bg-gradient-to-br from-blue-500 to-indigo-600"></div>
            <div class="stat-content">
              <div class="stat-value counter">{{ users.length }}</div>
              <div class="stat-label">Total Users</div>
            </div>
          </div>

          <div class="stat-card">
            <div class="stat-icon bg-gradient-to-br from-green-500 to-emerald-600"></div>
            <div class="stat-content">
              <div class="stat-value counter">3</div>
              <div class="stat-label">Active Today</div>
            </div>
          </div>

          <div class="stat-card">
            <div class="stat-icon bg-gradient-to-br from-purple-500 to-pink-600"></div>
            <div class="stat-content">
              <div class="stat-value counter">2</div>
              <div class="stat-label">New This Week</div>
            </div>
          </div>
        </div>

        <!-- Users Grid -->
        <div class="users-grid">
          @for (user of users; track user.email; let i = $index) {
          <div class="user-card" [style.animation-delay.s]="i * 0.1">
            <div class="user-card-header">
              <div class="user-avatar-wrapper">
                <div class="user-avatar">{{ user.initials }}</div>
                <span class="status-badge online"></span>
              </div>
              <div class="user-info">
                <h3 class="user-name">{{ user.name }}</h3>
                <p class="user-role">{{ user.role }}</p>
                <p class="user-email">{{ user.email }}</p>
              </div>
            </div>
            <div class="user-card-actions">
              <button class="btn-icon btn-edit" title="Edit">Edit</button>
              <button class="btn-icon btn-delete" title="Delete">Delete</button>
            </div>
          </div>
          }
        </div>
      </main>
    </div>
  `,
  styles: [
    `
      /* Wrapper and Background */
      .user-management-wrapper {
        min-height: 100vh;
        padding: 2rem;
        background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
        position: relative;
        overflow: hidden;
      }

      /* Animated Orbs */
      .orb {
        position: fixed;
        border-radius: 50%;
        filter: blur(80px);
        opacity: 0.4;
        animation: float-orb 20s ease-in-out infinite;
        z-index: 0;
      }

      .orb-1 {
        width: 400px;
        height: 400px;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        top: -100px;
        left: -100px;
      }

      .orb-2 {
        width: 300px;
        height: 300px;
        background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
        bottom: -50px;
        right: -50px;
        animation-delay: 7s;
      }

      .orb-3 {
        width: 250px;
        height: 250px;
        background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
        top: 50%;
        left: 50%;
        animation-delay: 14s;
      }

      @keyframes float-orb {
        0%,
        100% {
          transform: translate(0, 0) scale(1);
        }
        33% {
          transform: translate(50px, -80px) scale(1.1);
        }
        66% {
          transform: translate(-30px, 40px) scale(0.9);
        }
      }

      /* Glass Effects */
      .glass-card,
      .header-glass {
        backdrop-filter: blur(12px) saturate(180%);
        background-color: rgba(255, 255, 255, 0.9);
        border: 1px solid rgba(255, 255, 255, 0.4);
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
      }

      /* Text Gradient */
      .text-gradient {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
      }

      /* Back Button */
      .btn-back {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        padding: 0.75rem 1.5rem;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        border: none;
        border-radius: 12px;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.3s ease;
        box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
      }

      .btn-back:hover {
        transform: translateY(-2px);
        box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
      }

      /* Search Container */
      .search-container {
        display: flex;
        gap: 1rem;
        padding: 1.5rem;
        border-radius: 16px;
        animation: slide-in 0.6s ease;
      }

      @keyframes slide-in {
        from {
          opacity: 0;
          transform: translateY(-20px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }

      .search-input {
        flex: 1;
        padding: 1rem 1rem 1rem 3rem;
        border: 2px solid transparent;
        background: rgba(255, 255, 255, 0.8);
        border-radius: 12px;
        font-size: 1rem;
        transition: all 0.3s ease;
      }

      .search-input:focus {
        outline: none;
        border-color: #667eea;
        background: white;
        box-shadow: 0 0 0 4px rgba(102, 126, 234, 0.1);
      }

      .btn-add {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        padding: 0.75rem 2rem;
        background: linear-gradient(135deg, #10b981 0%, #059669 100%);
        color: white;
        border: none;
        border-radius: 12px;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.3s ease;
        box-shadow: 0 4px 15px rgba(16, 185, 129, 0.3);
        white-space: nowrap;
      }

      .btn-add:hover {
        transform: translateY(-2px);
        box-shadow: 0 6px 20px rgba(16, 185, 129, 0.4);
      }

      /* Stats Grid */
      .stats-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 1.5rem;
      }

      .stat-card {
        display: flex;
        align-items: center;
        gap: 1rem;
        padding: 1.5rem;
        background: rgba(255, 255, 255, 0.95);
        backdrop-filter: blur(10px);
        border-radius: 16px;
        border: 1px solid rgba(255, 255, 255, 0.4);
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
        transition: all 0.3s ease;
        animation: fade-in-up 0.6s ease;
      }

      @keyframes fade-in-up {
        from {
          opacity: 0;
          transform: translateY(20px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }

      .stat-card:hover {
        transform: translateY(-5px);
        box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
      }

      .stat-icon {
        width: 3.5rem;
        height: 3.5rem;
        border-radius: 14px;
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
        flex-shrink: 0;
      }

      .stat-content {
        flex: 1;
      }

      .stat-value {
        font-size: 2rem;
        font-weight: 700;
        color: #1f2937;
        line-height: 1;
        margin-bottom: 0.25rem;
      }

      .stat-label {
        font-size: 0.875rem;
        color: #6b7280;
        font-weight: 500;
      }

      /* Counter Animation */
      .counter {
        animation: count-up 1s ease-out;
      }

      @keyframes count-up {
        from {
          opacity: 0;
          transform: scale(0.5);
        }
        to {
          opacity: 1;
          transform: scale(1);
        }
      }

      /* Users Grid */
      .users-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
        gap: 1.5rem;
      }

      /* User Card */
      .user-card {
        background: rgba(255, 255, 255, 0.95);
        backdrop-filter: blur(10px);
        border-radius: 20px;
        padding: 1.5rem;
        border: 1px solid rgba(255, 255, 255, 0.4);
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
        transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        animation: card-entrance 0.6s ease both;
        position: relative;
        overflow: hidden;
      }

      @keyframes card-entrance {
        from {
          opacity: 0;
          transform: translateY(30px) scale(0.9);
        }
        to {
          opacity: 1;
          transform: translateY(0) scale(1);
        }
      }

      .user-card::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        height: 4px;
        background: linear-gradient(90deg, #667eea, #764ba2);
        transform: scaleX(0);
        transition: transform 0.3s ease;
      }

      .user-card:hover::before {
        transform: scaleX(1);
      }

      .user-card:hover {
        transform: translateY(-8px) scale(1.02);
        box-shadow: 0 20px 40px rgba(102, 126, 234, 0.25);
        border-color: rgba(102, 126, 234, 0.3);
      }

      .user-card-header {
        display: flex;
        align-items: flex-start;
        gap: 1rem;
        margin-bottom: 1rem;
      }

      /* Avatar */
      .user-avatar-wrapper {
        position: relative;
        flex-shrink: 0;
      }

      .user-avatar {
        width: 4rem;
        height: 4rem;
        border-radius: 50%;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: 700;
        font-size: 1.25rem;
        box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
        transition: all 0.3s ease;
      }

      .user-card:hover .user-avatar {
        transform: scale(1.1) rotate(5deg);
        box-shadow: 0 8px 20px rgba(102, 126, 234, 0.4);
      }

      /* Status Badge */
      .status-badge {
        position: absolute;
        bottom: 0;
        right: 0;
        width: 1rem;
        height: 1rem;
        border-radius: 50%;
        border: 3px solid white;
        animation: pulse-online 2s ease-in-out infinite;
      }

      .status-badge.online {
        background: #10b981;
      }

      @keyframes pulse-online {
        0%,
        100% {
          box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.7);
        }
        50% {
          box-shadow: 0 0 0 6px rgba(16, 185, 129, 0);
        }
      }

      /* User Info */
      .user-info {
        flex: 1;
        min-width: 0;
      }

      .user-name {
        font-size: 1.125rem;
        font-weight: 600;
        color: #1f2937;
        margin-bottom: 0.25rem;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .user-role {
        font-size: 0.875rem;
        color: #667eea;
        font-weight: 600;
        margin-bottom: 0.25rem;
      }

      .user-email {
        font-size: 0.8125rem;
        color: #6b7280;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      /* Actions */
      .user-card-actions {
        display: flex;
        gap: 0.5rem;
        padding-top: 1rem;
        border-top: 1px solid rgba(0, 0, 0, 0.05);
      }

      .btn-icon {
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 0.75rem;
        border: none;
        border-radius: 10px;
        cursor: pointer;
        transition: all 0.3s ease;
        color: white;
      }

      .btn-edit {
        background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
        box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
      }

      .btn-edit:hover {
        transform: translateY(-2px);
        box-shadow: 0 6px 16px rgba(59, 130, 246, 0.4);
      }

      .btn-delete {
        background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
        box-shadow: 0 4px 12px rgba(239, 68, 68, 0.3);
      }

      .btn-delete:hover {
        transform: translateY(-2px);
        box-shadow: 0 6px 16px rgba(239, 68, 68, 0.4);
      }

      /* Responsive */
      @media (max-width: 768px) {
        .user-management-wrapper {
          padding: 1rem;
        }

        .users-grid {
          grid-template-columns: 1fr;
        }

        .search-container {
          flex-direction: column;
        }

        .stats-grid {
          grid-template-columns: 1fr;
        }
      }
    `,
  ],
})
export class UserManagementComponent {
  private router = inject(Router);

  users = [
    { name: 'John Doe', role: 'Administrator', email: 'john@example.com', initials: 'JD' },
    { name: 'Jane Smith', role: 'Fleet Manager', email: 'jane@example.com', initials: 'JS' },
    { name: 'Bob Wilson', role: 'Driver', email: 'bob@example.com', initials: 'BW' },
    { name: 'Alice Brown', role: 'Driver', email: 'alice@example.com', initials: 'AB' },
    { name: 'Charlie Davis', role: 'Mechanic', email: 'charlie@example.com', initials: 'CD' },
  ];

  goBack() {
    this.router.navigate(['/home']);
  }
}
