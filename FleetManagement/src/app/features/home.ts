import { Component, inject, DestroyRef } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [],
  template: `
    <div class="home-wrapper">
      <!-- Animated Background -->
      <div class="animated-bg"></div>

      <!-- Header with Glassmorphism -->
      <header
        class="header-glass sticky top-0 z-50 backdrop-blur-md bg-white/80 shadow-lg border-b border-white/20"
      >
        <div class="max-w-7xl mx-auto px-8 py-4 flex justify-between items-center">
          <div class="flex items-center gap-4 animate-fade-in">
            <div class="logo-pulse w-14 h-14 relative">
              <a href="http://localhost:4200/home" target="_blank">
                <img
                  src="https://img.icons8.com/?size=100&id=gyxi94qFz5rS&format=png&color=000000"
                  class="w-full h-full object-contain"
                  alt="Fleet Logo"
                />
              </a>
            </div>
            <h1
              class="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent"
            >
              FleetManagement
            </h1>
          </div>
          <div class="flex items-center gap-4">
            @if (currentUser) {
            <div class="user-badge">
              <span class="text-gray-700 font-medium">{{ currentUser.username }}</span>
            </div>
            }
            <button (click)="onLogout()" class="btn-logout group">
              <span>Logout</span>
            </button>
          </div>
        </div>
      </header>

      <!-- Main Content -->
      <main class="flex-1 p-8 relative z-10">
        <div class="max-w-7xl mx-auto">
          <div class="text-center mb-12 animate-slide-up">
            <h2 class="text-5xl font-extrabold text-gray-800 mb-4 tracking-tight">
              Welcome to <span class="text-gradient">Fleet Management</span>
            </h2>
            <p class="text-xl text-gray-600">Manage your fleet with ease and efficiency</p>

            <!-- Guest Mode Banner -->
            @if (isGuest) {
            <div class="guest-banner-animated">
              <div class="flex items-start gap-3">
                <div class="flex-1 text-left">
                  <strong class="text-yellow-800 font-bold block mb-1">Guest Mode Active</strong>
                  <p class="text-yellow-700 text-sm">
                    You are browsing with limited access. Some features may be restricted.
                  </p>
                </div>
              </div>
            </div>
            }
          </div>

          <!-- Cards Grid with Stagger Animation -->
          <div class="cards-grid">
            <div
              (click)="navigateTo('/dashboard')"
              class="feature-card"
              style="animation-delay: 0.1s"
            >
              <div class="card-icon bg-gradient-to-br from-blue-500 to-indigo-600"></div>
              <h3 class="text-xl font-bold text-gray-800 mb-2">Dashboard</h3>
              <p class="text-gray-600 text-sm">Overview and statistics</p>
              <div class="card-arrow">→</div>
            </div>

            <div
              (click)="navigateTo('/vehicle-list')"
              class="feature-card"
              style="animation-delay: 0.2s"
            >
              <div class="card-icon bg-gradient-to-br from-green-500 to-emerald-600"></div>
              <h3 class="text-xl font-bold text-gray-800 mb-2">Vehicle List</h3>
              <p class="text-gray-600 text-sm">Browse all vehicles</p>
              <div class="card-arrow">→</div>
            </div>

            <div
              (click)="navigateTo('/vehicle-detail')"
              class="feature-card"
              style="animation-delay: 0.3s"
            >
              <div class="card-icon bg-gradient-to-br from-purple-500 to-pink-600"></div>
              <h3 class="text-xl font-bold text-gray-800 mb-2">Vehicle Details</h3>
              <p class="text-gray-600 text-sm">Detailed information</p>
              <div class="card-arrow">→</div>
            </div>

            <div
              (click)="navigateTo('/general-map')"
              class="feature-card"
              style="animation-delay: 0.4s"
            >
              <div class="card-icon bg-gradient-to-br from-red-500 to-orange-600"></div>
              <h3 class="text-xl font-bold text-gray-800 mb-2">General Map</h3>
              <p class="text-gray-600 text-sm">View all on map</p>
              <div class="card-arrow">→</div>
            </div>

            <div
              (click)="navigateTo('/vehicle-form')"
              class="feature-card"
              style="animation-delay: 0.5s"
            >
              <div class="card-icon bg-gradient-to-br from-cyan-500 to-blue-600"></div>
              <h3 class="text-xl font-bold text-gray-800 mb-2">Vehicle Form</h3>
              <p class="text-gray-600 text-sm">Create/Edit vehicles</p>
              <div class="card-arrow">→</div>
            </div>

            <div
              (click)="navigateTo('/user-management')"
              class="feature-card"
              style="animation-delay: 0.6s"
            >
              <div class="card-icon bg-gradient-to-br from-yellow-500 to-amber-600"></div>
              <h3 class="text-xl font-bold text-gray-800 mb-2">User Management</h3>
              <p class="text-gray-600 text-sm">Manage users</p>
              <div class="card-arrow">→</div>
            </div>

            <div
              (click)="navigateTo('/associations')"
              class="feature-card"
              style="animation-delay: 0.7s"
            >
              <div class="card-icon bg-gradient-to-br from-teal-500 to-green-600"></div>
              <h3 class="text-xl font-bold text-gray-800 mb-2">Associations</h3>
              <p class="text-gray-600 text-sm">Manage associations</p>
              <div class="card-arrow">→</div>
            </div>

            <div
              (click)="navigateTo('/reports')"
              class="feature-card"
              style="animation-delay: 0.8s"
            >
              <div class="card-icon bg-gradient-to-br from-indigo-500 to-purple-600"></div>
              <h3 class="text-xl font-bold text-gray-800 mb-2">Reports</h3>
              <p class="text-gray-600 text-sm">Analytics and stats</p>
              <div class="card-arrow">→</div>
            </div>

            <div
              (click)="navigateTo('/documents')"
              class="feature-card"
              style="animation-delay: 0.9s"
            >
              <div class="card-icon bg-gradient-to-br from-pink-500 to-rose-600"></div>
              <h3 class="text-xl font-bold text-gray-800 mb-2">Documents</h3>
              <p class="text-gray-600 text-sm">Document management</p>
              <div class="card-arrow">→</div>
            </div>
          </div>
        </div>
      </main>

      <!-- Footer -->
      <footer class="footer-glass backdrop-blur-md bg-white/80 border-t border-white/20 mt-auto">
        <div class="max-w-7xl mx-auto px-8 py-6 text-center">
          <p class="text-gray-600 text-sm">© 2025 Fleet Management System. All rights reserved.</p>
        </div>
      </footer>
    </div>
  `,
  styles: [
    `
      /* Background Animation */
      .home-wrapper {
        min-height: 100vh;
        display: flex;
        flex-direction: column;
        position: relative;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        overflow-x: hidden;
      }

      .animated-bg {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
        z-index: 0;
      }

      .animated-bg::before,
      .animated-bg::after {
        content: '';
        position: absolute;
        width: 600px;
        height: 600px;
        border-radius: 50%;
        filter: blur(100px);
        opacity: 0.3;
        animation: float 20s ease-in-out infinite;
      }

      .animated-bg::before {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        top: -200px;
        left: -200px;
        animation-delay: 0s;
      }

      .animated-bg::after {
        background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
        bottom: -200px;
        right: -200px;
        animation-delay: 5s;
      }

      @keyframes float {
        0%,
        100% {
          transform: translate(0, 0) scale(1);
        }
        33% {
          transform: translate(30px, -50px) scale(1.1);
        }
        66% {
          transform: translate(-20px, 20px) scale(0.9);
        }
      }

      /* Glassmorphism */
      .header-glass,
      .footer-glass {
        backdrop-filter: blur(10px) saturate(180%);
        background-color: rgba(255, 255, 255, 0.85);
        border: 1px solid rgba(255, 255, 255, 0.3);
      }

      /* Logo Animation */
      .logo-pulse {
        animation: pulse-border 2s ease-in-out infinite;
        border-radius: 12px;
        transition: transform 0.3s ease;
      }

      .logo-pulse:hover {
        transform: scale(1.1) rotate(5deg);
      }

      @keyframes pulse-border {
        0%,
        100% {
          box-shadow: 0 0 0 0 rgba(102, 126, 234, 0.7);
        }
        50% {
          box-shadow: 0 0 0 20px rgba(102, 126, 234, 0);
        }
      }

      /* Text Gradient */
      .text-gradient {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
        animation: gradient-shift 3s ease infinite;
      }

      @keyframes gradient-shift {
        0%,
        100% {
          filter: hue-rotate(0deg);
        }
        50% {
          filter: hue-rotate(45deg);
        }
      }

      /* User Badge */
      .user-badge {
        padding: 0.5rem 1rem;
        background: rgba(255, 255, 255, 0.9);
        border-radius: 20px;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        border: 1px solid rgba(102, 126, 234, 0.2);
        animation: fade-in 0.5s ease;
      }

      /* Logout Button */
      .btn-logout {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        padding: 0.625rem 1.5rem;
        background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
        color: white;
        border: none;
        border-radius: 10px;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.3s ease;
        box-shadow: 0 4px 15px rgba(239, 68, 68, 0.3);
      }

      .btn-logout:hover {
        transform: translateY(-2px);
        box-shadow: 0 6px 20px rgba(239, 68, 68, 0.4);
      }

      .btn-logout:active {
        transform: translateY(0);
      }

      /* Guest Banner */
      .guest-banner-animated {
        background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
        border-left: 4px solid #f59e0b;
        padding: 1rem 1.5rem;
        margin: 1.5rem auto;
        max-width: 42rem;
        border-radius: 12px;
        box-shadow: 0 4px 20px rgba(245, 158, 11, 0.2);
        animation: slide-down 0.5s ease;
      }

      @keyframes slide-down {
        from {
          opacity: 0;
          transform: translateY(-20px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }

      /* Cards Grid */
      .cards-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
        gap: 2rem;
        margin-bottom: 2rem;
      }

      /* Feature Card */
      .feature-card {
        position: relative;
        background: rgba(255, 255, 255, 0.95);
        backdrop-filter: blur(10px);
        border-radius: 20px;
        padding: 2rem;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
        cursor: pointer;
        transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        border: 1px solid rgba(255, 255, 255, 0.3);
        overflow: hidden;
        animation: slide-up 0.6s ease both;
      }

      @keyframes slide-up {
        from {
          opacity: 0;
          transform: translateY(30px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }

      .feature-card::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: linear-gradient(
          135deg,
          rgba(102, 126, 234, 0.1) 0%,
          rgba(118, 75, 162, 0.1) 100%
        );
        opacity: 0;
        transition: opacity 0.3s ease;
        z-index: 0;
      }

      .feature-card:hover::before {
        opacity: 1;
      }

      .feature-card:hover {
        transform: translateY(-10px) scale(1.02);
        box-shadow: 0 20px 40px rgba(102, 126, 234, 0.3);
        border-color: rgba(102, 126, 234, 0.5);
      }

      .feature-card > * {
        position: relative;
        z-index: 1;
      }

      /* Card Icon */
      .card-icon {
        width: 4rem;
        height: 4rem;
        border-radius: 16px;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-bottom: 1rem;
        color: white;
        box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
        transition: all 0.3s ease;
      }

      .feature-card:hover .card-icon {
        transform: scale(1.1) rotate(5deg);
        box-shadow: 0 12px 24px rgba(0, 0, 0, 0.3);
      }

      /* Card Arrow */
      .card-arrow {
        position: absolute;
        bottom: 1.5rem;
        right: 1.5rem;
        font-size: 1.5rem;
        color: #667eea;
        opacity: 0;
        transform: translateX(-10px);
        transition: all 0.3s ease;
      }

      .feature-card:hover .card-arrow {
        opacity: 1;
        transform: translateX(0);
      }

      /* Animations */
      @keyframes fade-in {
        from {
          opacity: 0;
        }
        to {
          opacity: 1;
        }
      }

      .animate-fade-in {
        animation: fade-in 0.6s ease;
      }

      .animate-slide-up {
        animation: slide-up 0.8s ease;
      }

      /* Responsive */
      @media (max-width: 768px) {
        .cards-grid {
          grid-template-columns: 1fr;
          gap: 1rem;
        }

        .feature-card {
          padding: 1.5rem;
        }

        .animated-bg::before,
        .animated-bg::after {
          width: 400px;
          height: 400px;
        }
      }
    `,
  ],
})
export class HomeComponent {
  private authService = inject(AuthService);
  private router = inject(Router);
  private destroyRef = inject(DestroyRef);

  currentUser = this.authService.getCurrentUser();
  isGuest = this.authService.isGuestMode();

  navigateTo(route: string) {
    this.router.navigate([route]);
  }

  onLogout() {
    if (confirm('Are you sure you want to logout?')) {
      this.authService
        .logout()
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe({
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
