import {
  Component,
  inject,
  OnInit,
  signal,
  ViewChild,
  ElementRef,
  AfterViewInit,
} from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { SidebarComponent } from '../../shared/sidebar.component';
import { StatCardComponent } from '../../shared/stat-card.component';
import { IVehicle } from '../../models/IVehicle';
import { VehicleService } from '../../services/vehicle.service';
import { Chart, ArcElement, Tooltip, Legend, PieController } from 'chart.js';

// Register Chart.js components
Chart.register(ArcElement, Tooltip, Legend, PieController);

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [SidebarComponent, StatCardComponent],
  template: `
    <div class="page-container">
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

      <!-- Sidebar -->
      <button
        class="sidebar-toggle-btn"
        (click)="toggleSidebar()"
        [title]="showSidebar() ? 'Hide Sidebar' : 'Show Sidebar'"
      >
        <span>{{ showSidebar() ? '&laquo;' : '&raquo;' }}</span>
      </button>

      <!-- Main  -->
      <div class="content-wrapper" [class.full-width]="!showSidebar()">
        <main class="page-content">
          <div class="page-header">
            <h2>Dashboard</h2>
            <button class="btn-back" (click)="goBack()">&laquo; Back to Home</button>
          </div>
          <div class="stats-grid">
            <app-stat-card title="Total Vehicles" [value]="vehicleList().length"></app-stat-card>

            <app-stat-card title="Available" [value]="activeVehicles"></app-stat-card>

            <app-stat-card title="In Use" [value]="inUseVehicles"></app-stat-card>

            <app-stat-card title="In Maintenance" [value]="maintenanceVehicles"></app-stat-card>

            <app-stat-card title="Out of Service" [value]="outOfServiceVehicles"></app-stat-card>
          </div>

          <!-- Vehicle Status Chart -->
          <div class="chart-container">
            <div class="chart-card">
              <h3 class="chart-title">Vehicle Status Distribution</h3>
              <div class="chart-wrapper">
                <canvas #pieChartCanvas></canvas>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  `,
  styles: [
    `
      .page-container {
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
        margin-left: 260px;
        display: flex;
        flex-direction: column;
        transition: margin-left 0.3s ease;
      }

      .content-wrapper.full-width {
        margin-left: 0;
      }

      .page-content {
        flex: 1;
        padding: 2rem;
      }

      .page-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 2rem;
      }

      .btn-back:hover {
        background: #667eea;
        color: white;
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
      }

      .stats-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: 1.5rem;
        margin-bottom: 2rem;
      }

      .chart-container {
        margin-top: 2rem;
      }

      .chart-card {
        background: white;
        border-radius: 1rem;
        padding: 2rem;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      }

      .chart-title {
        font-size: 1.25rem;
        font-weight: 600;
        color: #2d3748;
        margin-bottom: 1.5rem;
        text-align: center;
      }

      .chart-wrapper {
        max-width: 500px;
        margin: 0 auto;
        padding: 1rem;
      }

      h2 {
        font-size: 1.5rem;
        color: #2d3748;
        margin-bottom: 1rem;
      }

      p {
        color: #718096;
        line-height: 1.6;
        margin-bottom: 1.5rem;
      }

      ul {
        list-style: none;
        padding: 0;
      }

      li {
        padding: 0.5rem 0;
        color: #4a5568;
        font-size: 1rem;
        padding-left: 1.5rem;
        position: relative;
      }

      li:before {
        content: '';
        position: absolute;
        left: 0;
        top: 50%;
        transform: translateY(-50%);
        width: 6px;
        height: 6px;
        background: #667eea;
        border-radius: 50%;
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

        .page-content {
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
export class DashboardComponent implements OnInit, AfterViewInit {
  authService = inject(AuthService);
  router = inject(Router);
  vehicleList = signal<IVehicle[]>([]);
  vehicleService = inject(VehicleService);
  currentUser = this.authService.getCurrentUser();
  showSidebar = signal(true);

  @ViewChild('pieChartCanvas') pieChartCanvas!: ElementRef<HTMLCanvasElement>;
  private chart?: Chart;

  ngOnInit() {
    this.loadVehicles();
  }

  ngAfterViewInit() {
    this.initializeChart();
  }

  // Calcolo dei numeri di veicoli + filtro per stato
  get activeVehicles(): number {
    return this.vehicleList().filter(
      (v) => v.status.toLowerCase() === 'available' || v.status.toLowerCase() === 'active'
    ).length;
  }

  get maintenanceVehicles(): number {
    return this.vehicleList().filter((v) => v.status.toLowerCase() === 'maintenance').length;
  }

  get inUseVehicles(): number {
    return this.vehicleList().filter((v) => v.status.toLowerCase() === 'inuse').length;
  }

  get outOfServiceVehicles(): number {
    return this.vehicleList().filter((v) => v.status.toLowerCase() === 'outofservice').length;
  }

  private loadVehicles(): void {
    this.vehicleService.getListVehicles({ page: 1, pageSize: 1000 }).subscribe({
      next: (response) => {
        this.vehicleList.set(response.items);
        this.updateChartData();
      },
      error: (error) => {
        console.error('Error loading vehicles:', error);
      },
    });
  }
  // inserimento di chartjs
  private initializeChart(): void {
    const ctx = this.pieChartCanvas.nativeElement.getContext('2d');
    if (!ctx) return;

    this.chart = new Chart(ctx, {
      type: 'pie',
      data: {
        labels: ['Available', 'In Use', 'Maintenance', 'Out of Service'],
        datasets: [
          {
            data: [
              this.activeVehicles,
              this.inUseVehicles,
              this.maintenanceVehicles,
              this.outOfServiceVehicles,
            ],
            backgroundColor: [
              '#10b981', // Verde - Available
              '#3b82f6', // Blue - In Use
              '#f59e0b', // Arancio - Maintenance
              '#ef4444', // rosso - Out of Service
            ],
            borderColor: '#ffffff',
            borderWidth: 2,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              padding: 15,
              font: {
                size: 12,
              },
            },
          },
          tooltip: {
            callbacks: {
              label: (context) => {
                const label = context.label || '';
                const value = context.parsed;
                const total = (context.dataset.data as number[]).reduce((a, b) => a + b, 0);
                const percentage = total > 0 ? ((value / total) * 100).toFixed(1) : '0';
                return `${label}: ${value} (${percentage}%)`;
              },
            },
          },
        },
      },
    });
  }

  private updateChartData(): void {
    if (!this.chart) return;

    this.chart.data.datasets[0].data = [
      this.activeVehicles,
      this.inUseVehicles,
      this.maintenanceVehicles,
      this.outOfServiceVehicles,
    ];
    this.chart.update();
  }

  toggleSidebar() {
    this.showSidebar.update((value) => !value);
  }

  goBack() {
    this.router.navigate(['/home']);
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
