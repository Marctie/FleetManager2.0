import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import * as L from 'leaflet';

@Component({
  selector: 'app-location',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="page-container">
      <header class="page-header">
        <h1>Location Tracking</h1>
        <button class="btn-back" (click)="goBack()">Back to Home</button>
      </header>

      <main class="page-content">
        <div class="stats-row">
          <div class="stat-card">
            <span class="stat-value">18</span>
            <span class="stat-label">Moving</span>
          </div>
          <div class="stat-card">
            <span class="stat-value">6</span>
            <span class="stat-label">Parked</span>
          </div>
          <div class="stat-card">
            <span class="stat-value">98%</span>
            <span class="stat-label">GPS Active</span>
          </div>
        </div>

        <div class="content-card">
          <h2>Real-Time Location Map</h2>
          <p>
            Track vehicle positions in real-time - Use layer control to switch between Street,
            Cycling and Satellite views
          </p>
          <div id="map" class="map-container"></div>
        </div>
      </main>
    </div>
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
        max-width: 1400px;
        margin: 0 auto;
      }

      .stats-row {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 1.5rem;
        margin-bottom: 2rem;
      }

      .stat-card {
        background: white;
        padding: 1.5rem;
        border-radius: 1rem;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        display: flex;
        flex-direction: column;
        align-items: center;
      }

      .stat-value {
        font-size: 2.5rem;
        font-weight: 700;
        color: #667eea;
        margin-bottom: 0.5rem;
      }

      .stat-label {
        font-size: 0.875rem;
        color: #718096;
        text-align: center;
      }

      .content-card {
        background: white;
        padding: 2rem;
        border-radius: 1rem;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        display: flex;
        flex-direction: column;
        height: calc(100vh - 350px);
        min-height: 500px;
      }

      .content-card h2 {
        font-size: 1.5rem;
        color: #2d3748;
        margin-bottom: 0.5rem;
        font-weight: 600;
        flex-shrink: 0;
      }

      .content-card p {
        color: #718096;
        margin-bottom: 1.5rem;
        flex-shrink: 0;
      }

      .map-container {
        flex: 1;
        width: 100%;
        min-height: 400px;
        border-radius: 0.5rem;
        overflow: hidden;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        position: relative;
        z-index: 1;
      }

      /* Ensure Leaflet renders correctly */
      :host ::ng-deep .map-container .leaflet-container {
        height: 100%;
        width: 100%;
        border-radius: 0.5rem;
      }

      @media (max-width: 768px) {
        .page-container {
          padding: 1rem;
        }

        .page-header {
          flex-direction: column;
          gap: 1rem;
          align-items: flex-start;
        }

        .page-header h1 {
          font-size: 1.5rem;
        }

        .map-container {
          height: 400px;
        }
      }
    `,
  ],
})
export class LocationComponent implements AfterViewInit, OnDestroy {
  private map: L.Map | undefined;

  constructor(private router: Router) {}

  ngAfterViewInit(): void {
    this.initMap();
  }

  ngOnDestroy(): void {
    if (this.map) {
      this.map.remove();
    }
  }

  private initMap(): void {
    // Initialize map centered on Rome, Italy
    this.map = L.map('map', {
      center: [41.9028, 12.4964],
      zoom: 13,
      zoomControl: true,
      attributionControl: true,
    });

    // Define base layers
    const streetLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '© OpenStreetMap contributors',
    });

    const cyclingLayer = L.tileLayer(
      'https://{s}.tile-cyclosm.openstreetmap.fr/cyclosm/{z}/{x}/{y}.png',
      {
        maxZoom: 20,
        attribution: '© OpenStreetMap contributors, CyclOSM',
      }
    );

    const satelliteLayer = L.tileLayer(
      'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
      {
        maxZoom: 19,
        attribution: '© Esri, Maxar, GeoEye, Earthstar Geographics',
      }
    );

    // Add default layer (street)
    streetLayer.addTo(this.map);

    // Define layer control
    const baseMaps = {
      Street: streetLayer,
      Cycling: cyclingLayer,
      Satellite: satelliteLayer,
    };

    // Add layer control to map
    L.control.layers(baseMaps).addTo(this.map);

    // Force map to recalculate size after initialization
    setTimeout(() => {
      if (this.map) {
        this.map.invalidateSize();
      }
    }, 100);

    // Add some sample vehicle markers
    this.addSampleVehicles();
  }

  private addSampleVehicles(): void {
    if (!this.map) return;

    // Custom icon for vehicles
    const vehicleIcon = L.icon({
      iconUrl:
        'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMiIgaGVpZ2h0PSIzMiIgdmlld0JveD0iMCAwIDMyIDMyIj48Y2lyY2xlIGN4PSIxNiIgY3k9IjE2IiByPSIxNCIgZmlsbD0iIzY2N2VlYSIvPjx0ZXh0IHg9IjE2IiB5PSIyMSIgZm9udC1zaXplPSIxOCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0id2hpdGUiPjxzdmc+PC90ZXh0Pjwvc3ZnPg==',
      iconSize: [32, 32],
      iconAnchor: [16, 16],
      popupAnchor: [0, -16],
    });

    // Sample vehicle locations
    const vehicles = [
      { id: 'V001', lat: 41.9028, lng: 12.4964, status: 'Moving', driver: 'John Doe' },
      { id: 'V002', lat: 41.91, lng: 12.5, status: 'Parked', driver: 'Jane Smith' },
      { id: 'V003', lat: 41.895, lng: 12.485, status: 'Moving', driver: 'Bob Johnson' },
      { id: 'V004', lat: 41.915, lng: 12.51, status: 'Moving', driver: 'Alice Brown' },
      { id: 'V005', lat: 41.89, lng: 12.49, status: 'Parked', driver: 'Charlie Wilson' },
    ];

    vehicles.forEach((vehicle) => {
      const marker = L.marker([vehicle.lat, vehicle.lng], { icon: vehicleIcon }).addTo(this.map!);

      marker.bindPopup(`
        <div style="font-family: Arial, sans-serif;">
          <strong style="color: #667eea; font-size: 16px;">${vehicle.id}</strong><br>
          <strong>Status:</strong> ${vehicle.status}<br>
          <strong>Driver:</strong> ${vehicle.driver}<br>
          <strong>Position:</strong> ${vehicle.lat.toFixed(4)}, ${vehicle.lng.toFixed(4)}
        </div>
      `);
    });
  }

  goBack() {
    this.router.navigate(['/home']);
  }
}
