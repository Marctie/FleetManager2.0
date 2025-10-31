import {
  Component,
  OnInit,
  AfterViewInit,
  OnDestroy,
  inject,
  signal,
  input,
  effect,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import * as L from 'leaflet';
import { VehiclePosition } from '../../models/vehicle-position';
import { IVehicle } from '../../models/IVehicle';
import { VehicleService } from '../../services/vehicle.service';
import { MqttService, VehiclePositionUpdate } from '../../services/mqtt.service';
import { MainLayoutComponent } from '../../shared/main-layout.component';
import { StatCardComponent } from '../../shared/stat-card.component';

@Component({
  selector: 'app-general-map',
  standalone: true,
  imports: [CommonModule, MainLayoutComponent, StatCardComponent],
  template: `
    <app-main-layout>
      <div class="page-container">
        <header class="page-header">
          <h1>General Map</h1>
          <div class="header-controls">
            <div class="map-view-selector">
              <label>View:</label>
              <select [value]="currentMapView()" (change)="changeMapView($event)">
                <option value="street">Street</option>
                <option value="satellite">Satellite</option>
                <option value="cycle">Cycling</option>
              </select>
            </div>
            <button class="btn-refresh" (click)="refreshAllVehicles()">Update Positions</button>
            <button class="btn-back" (click)="goBack()">Back</button>
          </div>
        </header>

        <div class="stats-section">
          <div class="stats-grid">
            <!-- <div class="stat-card">
              <span class="stat-label">Total Vehicles</span>
              <span class="stat-value">{{ vehicleList().length }}</span>
            </div>
            <div class="stat-card">
              <span class="stat-label">With Position</span>
              <span class="stat-value">{{ getVehiclesWithPosition() }}</span>
            </div>
            <div class="stat-card online-status">
              <span class="stat-label">Online</span>
              <span class="stat-value">{{ getVehiclesOnline() }}</span>
            </div>
            <div class="stat-card offline-status">
              <span class="stat-label">Offline</span>
              <span class="stat-value">{{ getVehiclesOffline() }}</span>
            </div>
            <div class="stat-card maintenance-status">
              <span class="stat-label">Maintenance</span>
              <span class="stat-value">{{ getVehiclesMaintenance() }}</span>
            </div> -->

            <app-stat-card
              class="total-status"
              title="Total Vehicles"
              [value]="vehicleList().length"
            ></app-stat-card>
            <app-stat-card
              class="position-status"
              title="With Position"
              [value]="getVehiclesWithPosition()"
            ></app-stat-card>
            <app-stat-card
              class="online-status"
              title="Online"
              [value]="getVehiclesOnline()"
            ></app-stat-card>
            <app-stat-card
              class="offline-status"
              title="Offline"
              [value]="getVehiclesOffline()"
            ></app-stat-card>
            <app-stat-card
              class="maintenance-status"
              title="Maintenance"
              [value]="getVehiclesMaintenance()"
            ></app-stat-card>
          </div>
        </div>

        <!-- Map -->
        <main class="page-content">
          <div class="map-card">
            <div id="map" class="map-container"></div>
          </div>
        </main>

        <!-- Toast Notification -->
        @if (showToast()) {
        <div class="toast-notification" [class]="'toast-' + toastType()">
          <div class="toast-content">
            <span class="toast-message">{{ toastMessage() }}</span>
            <button class="toast-close" (click)="hideToastNotification()">×</button>
          </div>
        </div>
        }
      </div>
    </app-main-layout>
  `,
  styles: [
    `
      .page-container {
        min-height: 100vh;
        background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
        padding: 2rem;
        display: flex;
        flex-direction: column;
      }

      .page-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 1.5rem;
        flex-wrap: wrap;
        gap: 1rem;
      }

      .page-header h1 {
        font-size: 2rem;
        color: #2d3748;
        font-weight: 700;
        margin: 0;
      }

      .header-controls {
        display: flex;
        gap: 1rem;
        align-items: center;
        flex-wrap: wrap;
      }

      .map-view-selector {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        background: white;
        padding: 0.5rem 1rem;
        border-radius: 0.5rem;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      }

      .map-view-selector label {
        font-size: 0.875rem;
        font-weight: 500;
        color: #4a5568;
      }

      .map-view-selector select {
        padding: 0.375rem 0.75rem;
        border: 1px solid #cbd5e0;
        border-radius: 0.375rem;
        background-color: white;
        font-size: 0.875rem;
        color: #2d3748;
        cursor: pointer;
        transition: all 0.2s ease;
      }

      .map-view-selector select:hover {
        border-color: #667eea;
      }

      .map-view-selector select:focus {
        outline: none;
        border-color: #667eea;
        box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
      }

      .btn-refresh {
        padding: 0.75rem 1.5rem;
        background: linear-gradient(135deg, #48bb78 0%, #38a169 100%);
        color: white;
        border: none;
        border-radius: 0.5rem;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.3s ease;
      }

      .btn-refresh:hover {
        transform: translateY(-2px);
        box-shadow: 0 5px 15px rgba(72, 187, 120, 0.3);
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

      .btn-mqtt {
        padding: 0.75rem 1.5rem;
        background: linear-gradient(135deg, #ed8936 0%, #dd6b20 100%);
        color: white;
        border: none;
        border-radius: 0.5rem;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.3s ease;
      }

      .btn-mqtt:hover {
        transform: translateY(-2px);
        box-shadow: 0 5px 15px rgba(237, 137, 54, 0.3);
      }

      .btn-mqtt.connected {
        background: linear-gradient(135deg, #48bb78 0%, #38a169 100%);
      }

      .btn-mqtt.connected:hover {
        box-shadow: 0 5px 15px rgba(72, 187, 120, 0.3);
      }

      .stats-section {
        margin-bottom: 1.5rem;
      }

      .stats-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
        gap: 1rem;
      }

      .stat-card {
        background: white;
        padding: 1rem 1.5rem;
        border-radius: 0.75rem;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
        border-left: 4px solid #667eea;
        transition: transform 0.2s ease, box-shadow 0.2s ease;
      }

      .stat-card:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      }

      .stat-card.total-status {
        border-left-color: #667eea;
      }

      .stat-card.position-status {
        border-left-color: #805ad5;
      }

      .stat-card.online-status {
        border-left-color: #48bb78;
      }

      .stat-card.offline-status {
        border-left-color: #f56565;
      }

      .stat-card.maintenance-status {
        border-left-color: #ecc94b;
      }

      .stat-label {
        font-size: 0.75rem;
        color: #718096;
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 0.05em;
      }

      .stat-value {
        font-size: 1.875rem;
        font-weight: 700;
        color: #2d3748;
      }

      .page-content {
        flex: 1;
        display: flex;
        flex-direction: column;
        max-width: 1400px;
        width: 100%;
        margin: 0 auto;
      }

      .map-card {
        background: white;
        border-radius: 1rem;
        padding: 1.5rem;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        display: flex;
        flex-direction: column;
        flex: 1;
        min-height: 500px;
      }

      .map-container {
        flex: 1;
        border-radius: 0.5rem;
        overflow: hidden;
        min-height: 400px;
      }

      :host ::ng-deep .map-container .leaflet-container {
        height: 100%;
        width: 100%;
        border-radius: 0.5rem;
      }

      .toast-notification {
        position: fixed;
        top: 2rem;
        right: 2rem;
        z-index: 2000;
        border-radius: 0.5rem;
        box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
        animation: slideIn 0.3s ease-out;
        min-width: 300px;
        max-width: 400px;
      }

      .toast-success {
        background: linear-gradient(135deg, #48bb78, #38a169);
        color: white;
      }

      .toast-error {
        background: linear-gradient(135deg, #f56565, #e53e3e);
        color: white;
      }

      .toast-content {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 1rem 1.25rem;
      }

      .toast-message {
        font-weight: 500;
        font-size: 0.875rem;
      }

      .toast-close {
        background: none;
        border: none;
        color: white;
        font-size: 1.5rem;
        font-weight: bold;
        cursor: pointer;
        padding: 0;
        margin-left: 1rem;
        width: 24px;
        height: 24px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 50%;
        transition: background-color 0.2s ease;
      }

      .toast-close:hover {
        background-color: rgba(255, 255, 255, 0.2);
      }

      @keyframes slideIn {
        from {
          transform: translateX(100%);
          opacity: 0;
        }
        to {
          transform: translateX(0);
          opacity: 1;
        }
      }

      @media (max-width: 768px) {
        .page-container {
          padding: 1rem;
        }

        .page-header {
          flex-direction: column;
          align-items: stretch;
        }

        .page-header h1 {
          font-size: 1.5rem;
        }

        .header-controls {
          flex-direction: column;
        }

        .btn-back,
        .btn-refresh {
          width: 100%;
        }

        .stats-grid {
          grid-template-columns: repeat(2, 1fr);
        }

        .toast-notification {
          top: 1rem;
          right: 1rem;
          left: 1rem;
          min-width: auto;
          max-width: none;
        }
      }
    `,
  ],
})
export class GeneralMapComponent implements OnInit, AfterViewInit, OnDestroy {
  private map!: L.Map;
  private markers: L.Marker[] = [];
  private router = inject(Router);
  private vehicleService = inject(VehicleService);
  private mqttService = inject(MqttService);

  // Signals
  vehicleList = signal<IVehicle[]>([]);
  selectedVehicle = signal<IVehicle | null>(null);
  showToast = signal(false);
  toastMessage = signal('');
  toastType = signal<'success' | 'error'>('success');
  currentMapView = signal<'street' | 'satellite' | 'cycle'>('street');
  mqttConnected = signal(false);

  // Map layers
  private currentBaseLayer!: L.TileLayer;
  private streetLayer!: L.TileLayer;
  private satelliteLayer!: L.TileLayer;
  private cycleLayer!: L.TileLayer;

  private autoUpdateInterval: any = null;

  // Status colors
  private statusColorMap: { [key: string]: string } = {
    active: '#48bb78',
    online: '#48bb78',
    inactive: '#f56565',
    offline: '#f56565',
    maintenance: '#ecc94b',
    default: '#718096',
  };

  constructor() {
    effect(() => {
      const selected = this.selectedVehicle();
      if (this.map && selected) {
        console.log(`Selected vehicle changed: ${selected.licensePlate}`);
        this.addVehicleMarkers(true);
      }
    });
  }

  ngOnInit(): void {
    // 1. CONNETTI MQTT
    console.log('[GENERAL-MAP] Auto-connecting to MQTT...');
    this.mqttService.enableAndConnect();

    // 2. Carica veicoli
    this.loadVehicles();

    // 3. Subscribe agli aggiornamenti
    this.subscribeToMqttUpdates();

    // 4. Avvia auto-update
    this.startAutoUpdate();
  }

  ngAfterViewInit(): void {
    this.setupLeafletIcons();
    this.initMap();
  }

  ngOnDestroy(): void {
    this.stopAutoUpdate();
    if (this.map) {
      this.map.remove();
    }
  }
  // load dei veicoli e merge con dati mqtt
  private loadVehicles(silent: boolean = false): void {
    this.vehicleService.getListVehicles().subscribe({
      next: (vehicles) => {
        console.log(`[GENERAL-MAP] Loaded ${vehicles.length} vehicles from DB`);

        //recupero delle posizioni
        const mqttPositions = this.mqttService.getAllPositions();
        console.log(`[GENERAL-MAP] Found ${mqttPositions.length} MQTT positions in cache`);

        //unione dei dati
        const mergedVehicles = vehicles.map((vehicle) => {
          const mqttPosition = mqttPositions.find(
            (pos) => pos.vehicleId === vehicle.id || pos.vehicleId === vehicle.vehicleId
          );

          if (mqttPosition) {
            const mqttTimestamp = new Date(mqttPosition.timestamp).getTime();
            const dbTimestamp = vehicle.lastPosition?.timestamp
              ? new Date(vehicle.lastPosition.timestamp).getTime()
              : 0;

            if (mqttTimestamp > dbTimestamp) {
              console.log(
                `[GENERAL-MAP] Using MQTT position for vehicle ${vehicle.licensePlate} (${vehicle.id})`
              );

              return {
                ...vehicle,
                lastPosition: {
                  latitude: mqttPosition.latitude,
                  longitude: mqttPosition.longitude,
                  speed: mqttPosition.speed,
                  heading: mqttPosition.heading,
                  timestamp: mqttPosition.timestamp,
                },
                status: mqttPosition.status || vehicle.status,
              };
            }
          }

          return vehicle;
        });

        this.vehicleList.set(mergedVehicles);
        //aggiunta del marker su mappa
        if (this.map) {
          this.addVehicleMarkers(true);
          this.addUnlinkedMqttMarkers(mqttPositions, vehicles);
        }

        if (!silent) {
          const mqttCount = mergedVehicles.filter((v) =>
            mqttPositions.some((p) => p.vehicleId === v.id || p.vehicleId === v.vehicleId)
          ).length;
          const unlinkedCount = mqttPositions.length - mqttCount;
          console.log(
            `[GENERAL-MAP]Loaded ${vehicles.length} vehicles (${mqttCount} with MQTT data, ${unlinkedCount} MQTT-only markers)`
          );
        }
      },
      error: (error) => {
        console.error('[GENERAL-MAP] Error loading vehicles:', error);
        if (!silent) {
          this.showToastNotification('Error loading vehicles', 'error');
        }
      },
    });
  }

  /**
   * Carica le posizioni iniziali di tutti i veicoli tramite API
   */
  /**
   * SUBSCRIBE AGLI AGGIORNAMENTI MQTT REAL-TIME
   */
  private subscribeToMqttUpdates(): void {
    console.log('[GENERAL-MAP] Subscribing to MQTT vehicle position updates (Vehicles/#)');
    // Sottoscrizione agli aggiornamenti delle posizioni in tempo reale
    this.mqttService.getVehiclePositionUpdates().subscribe({
      next: (positionUpdate: VehiclePositionUpdate) => {
        console.log('[GENERAL-MAP] MQTT Position update received:', positionUpdate);
        this.updateVehiclePosition(positionUpdate);
      },
      error: (error) => {
        console.error('[GENERAL-MAP] MQTT subscription error:', error);
      },
    });

    this.mqttService.getConnectionStatus().subscribe({
      next: (isConnected: boolean) => {
        this.mqttConnected.set(isConnected);
        if (isConnected) {
          console.log('[GENERAL-MAP] MQTT connected');
          this.showToastNotification(' Real-time updates active', 'success');
        } else {
          console.warn('[GENERAL-MAP] MQTT disconnected');
        }
      },
    });
  }

  toggleMqttConnection() {
    if (this.mqttConnected()) {
      this.showToastNotification('MQTT connection management', 'success');
    } else {
      this.mqttService.enableAndConnect();
    }
  }

  /**
   * AGGIORNA POSIZIONE VEICOLO CON DATI MQTT
   */
  private updateVehiclePosition(positionUpdate: VehiclePositionUpdate): void {
    console.log('[GENERAL-MAP] MQTT position update received:', positionUpdate);

    const vehicles = this.vehicleList();
    // Cerca il veicolo
    const vehicleIndex = vehicles.findIndex((v) => {
      return v.id === positionUpdate.vehicleId || v.vehicleId === positionUpdate.vehicleId;
    });

    if (vehicleIndex !== -1) {
      const currentVehicle = vehicles[vehicleIndex];
      const mqttTimestamp = new Date(positionUpdate.timestamp).getTime();
      const currentTimestamp = currentVehicle.lastPosition?.timestamp
        ? new Date(currentVehicle.lastPosition.timestamp).getTime()
        : 0;

      if (mqttTimestamp >= currentTimestamp) {
        console.log(`[GENERAL-MAP] Updating vehicle ${currentVehicle.licensePlate} with MQTT data`);

        // Aggiorna il veicolo
        const updatedVehicle = {
          ...currentVehicle,
          lastPosition: {
            latitude: positionUpdate.latitude,
            longitude: positionUpdate.longitude,
            speed: positionUpdate.speed || 0,
            heading: positionUpdate.heading || 0,
            timestamp: positionUpdate.timestamp,
          },
          status: positionUpdate.status || currentVehicle.status,
        };

        // Aggiorna la lista
        const updatedVehicles = [...vehicles];
        updatedVehicles[vehicleIndex] = updatedVehicle;
        this.vehicleList.set(updatedVehicles);

        if (this.map) {
          this.addVehicleMarkers(true);
        }
      } else {
        console.log(
          `[GENERAL-MAP] Skipping older MQTT data for vehicle ${currentVehicle.licensePlate}`
        );
      }
    } else {
      console.log(`[GENERAL-MAP] Device not linked to vehicle, showing as MQTT marker`);

      if (this.map) {
        this.addMqttMarker(positionUpdate);
      }
    }
  }

  private addMqttMarker(position: VehiclePositionUpdate): void {
    console.log('[GENERAL-MAP] Adding MQTT marker for:', position);

    const marker = L.marker([position.latitude, position.longitude], {
      icon: L.icon({
        iconUrl:
          'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTEyIDJDOC4xMyAyIDUgNS4xMyA1IDlDNSAxNC4yNSAxMiAyMiAxMiAyMkMxMiAyMiAxOSAxNC4yNSAxOSA5QzE5IDUuMTMgMTUuODcgMiAxMiAyWk0xMiAxMS41QzEwLjYyIDExLjUgOS41IDEwLjM4IDkuNSA5QzkuNSA3LjYyIDEwLjYyIDYuNSAxMiA2LjVDMTMuMzggNi41IDE0LjUgNy42MiAxNC41IDlDMTQuNSAxMC4zOCAxMy4zOCAxMS41IDEyIDExLjVaIiBmaWxsPSIjZmY5ODAwIi8+Cjwvc3ZnPg==',
        iconSize: [32, 32],
        iconAnchor: [16, 32],
        popupAnchor: [0, -32],
      }),
    }).addTo(this.map!);

    const deviceId = position.deviceIdentifier || position.vehicleId;
    const popupContent = `
      <div style="font-family: system-ui, sans-serif; min-width: 200px;">
        
        <div style="display: grid; gap: 6px; font-size: 13px;">
          <div><strong>Device ID:</strong><br/>${deviceId}</div>
          <div><strong>Speed:</strong> ${position.speed} km/h</div>
          <div><strong>Heading:</strong> ${position.heading}°</div>
          <div><strong>Coordinates:</strong><br>
            &nbsp;&nbsp;Lat: ${position.latitude.toFixed(6)}<br>
            &nbsp;&nbsp;Lng: ${position.longitude.toFixed(6)}
          </div>
          <div style="font-size: 11px; color: #666; margin-top: 8px; padding-top: 8px; border-top: 1px solid #eee;">
            <strong>Last Update:</strong><br>
            ${new Date(position.timestamp).toLocaleString()}
          </div>
        </div>
      </div>
    `;

    marker.bindPopup(popupContent, {
      closeButton: true,
      autoClose: false,
      closeOnClick: false,
    });

    this.markers.push(marker);

    console.log(`[GENERAL-MAP] MQTT marker added at [${position.latitude}, ${position.longitude}]`);
  }

  private addUnlinkedMqttMarkers(
    mqttPositions: VehiclePositionUpdate[],
    vehicles: IVehicle[]
  ): void {
    console.log('[GENERAL-MAP] Checking for unlinked MQTT positions...');

    mqttPositions.forEach((position) => {
      // Verifica se questa posizione è già associata a un veicolo nel DB
      const isLinked = vehicles.some(
        (v) => v.id === position.vehicleId || v.vehicleId === position.vehicleId
      );

      if (!isLinked) {
        console.log(`[GENERAL-MAP] Unlinked MQTT position found:`, position);
        this.addMqttMarker(position);
      }
    });
  }

  private startAutoUpdate(): void {
    this.stopAutoUpdate();
    const updateInterval = 60000; // 60 Secondi per l'aggiornamento automatico
    console.log(`[GENERAL-MAP] Auto-update every ${updateInterval}ms`);

    this.autoUpdateInterval = setInterval(() => {
      console.log('[GENERAL-MAP] Auto-updating vehicle positions');
      this.loadVehicles(true);
    }, updateInterval);
  }

  private stopAutoUpdate(): void {
    if (this.autoUpdateInterval) {
      clearInterval(this.autoUpdateInterval);
      this.autoUpdateInterval = null;
    }
  }

  private setupLeafletIcons(): void {
    delete (L.Icon.Default.prototype as any)._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconUrl:
        'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTEyIDJDOC4xMyAyIDUgNS4xMyA1IDlDNSAxNC4yNSAxMiAyMiAxMiAyMkMxMiAyMiAxOSAxNC4yNSAxOSA5QzE5IDUuMTMgMTUuODcgMiAxMiAyWk0xMiAxMS41QzEwLjYyIDExLjUgOS41IDEwLjM4IDkuNSA5QzkuNSA3LjYyIDEwLjYyIDYuNSAxMiA2LjVDMTMuMzggNi41IDE0LjUgNy42MiAxNC41IDlDMTQuNSAxMC4zOCAxMy4zOCAxMS41IDEyIDExLjVaIiBmaWxsPSIjMDA3YmZmIi8+Cjwvc3ZnPg==',
      iconRetinaUrl:
        'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTEyIDJDOC4xMyAyIDUgNS4xMyA1IDlDNSAxNC4yNSAxMiAyMiAxMiAyMkMxMiAyMiAxOSAxNC4yNSAxOSA5QzE5IDUuMTMgMTUuODcgMiAxMiAyWk0xMiAxMS41QzEwLjYyIDExLjUgOS41IDEwLjM4IDkuNSA5QzkuNSA3LjYyIDEwLjYyIDYuNSAxMiA2LjVDMTMuMzggNi41IDE0LjUgNy42MiAxNC41IDlDMTQuNSAxMC4zOCAxMy4zOCAxMS41IDEyIDExLjVaIiBmaWxsPSIjMDA3YmZmIi8+Cjwvc3ZnPg==',
      shadowUrl: '',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
    });
  }

  private initMap(): void {
    this.map = L.map('map').setView([41.9028, 12.4964], 12);
    this.initMapLayers();

    if (this.vehicleList().length > 0) {
      this.addVehicleMarkers();
    }
  }

  private initMapLayers(): void {
    this.streetLayer = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 18,
      minZoom: 4,
    });

    this.satelliteLayer = L.tileLayer(
      'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
      {
        maxZoom: 18,
        minZoom: 4,
      }
    );

    this.cycleLayer = L.tileLayer(
      'https://{s}.tile-cyclosm.openstreetmap.fr/cyclosm/{z}/{x}/{y}.png',
      {
        maxZoom: 18,
        minZoom: 4,
      }
    );

    this.currentBaseLayer = this.streetLayer;
    this.currentBaseLayer.addTo(this.map);
  }

  changeMapView(event: Event): void {
    const target = event.target as HTMLSelectElement;
    const newView = target.value as 'street' | 'satellite' | 'cycle';

    this.map.removeLayer(this.currentBaseLayer);

    switch (newView) {
      case 'street':
        this.currentBaseLayer = this.streetLayer;
        break;
      case 'satellite':
        this.currentBaseLayer = this.satelliteLayer;
        break;
      case 'cycle':
        this.currentBaseLayer = this.cycleLayer;
        break;
    }

    this.currentBaseLayer.addTo(this.map);
    this.currentMapView.set(newView);
  }

  private addVehicleMarkers(preserveCurrentView: boolean = false): void {
    this.clearMarkers();

    if (this.selectedVehicle()) {
      const selectedVehicle = this.selectedVehicle()!;
      if (
        selectedVehicle.lastPosition &&
        selectedVehicle.lastPosition.latitude &&
        selectedVehicle.lastPosition.longitude
      ) {
        this.addVehicleMarker(selectedVehicle);
        if (!preserveCurrentView) {
          const position = selectedVehicle.lastPosition;
          this.map.setView([position.latitude, position.longitude], 15);
        }
      }
      return;
    }

    this.vehicleList().forEach((vehicle) => {
      if (vehicle.lastPosition && vehicle.lastPosition.latitude && vehicle.lastPosition.longitude) {
        this.addVehicleMarker(vehicle);
      }
    });

    if (this.markers.length > 0 && !preserveCurrentView) {
      const group = new L.FeatureGroup(this.markers);
      this.map.fitBounds(group.getBounds().pad(0.1));
    }

    console.log(`Added ${this.markers.length} markers on map`);
  }

  private addVehicleMarker(vehicle: IVehicle): void {
    const position = vehicle.lastPosition!;
    const markerColor = this.getStatusColor(vehicle.status);

    const customIcon = L.divIcon({
      className: 'custom-vehicle-marker',
      html: `
        <div style="
          background-color: ${markerColor};
          width: 20px;
          height: 20px;
          border-radius: 50%;
          border: 3px solid white;
          box-shadow: 0 2px 6px rgba(0,0,0,0.3);
          display: flex;
          align-items: center;
          justify-content: center;
        "></div>
      `,
      iconSize: [26, 26],
      iconAnchor: [13, 13],
      popupAnchor: [0, -13],
    });

    const marker = L.marker([position.latitude, position.longitude], {
      icon: customIcon,
    }).addTo(this.map);

    const popupContent = `
      <div style="font-family: Arial, sans-serif; min-width: 250px;">
        <h4 style="margin: 0 0 10px 0; color: #667eea; text-align: center;">
          ${vehicle.licensePlate}
        </h4>
        <div style="
          background: ${markerColor};
          color: white;
          padding: 6px 12px;
          border-radius: 6px;
          font-size: 12px;
          margin-bottom: 12px;
          text-align: center;
          font-weight: bold;
          text-transform: uppercase;
        ">
          STATUS: ${vehicle.status}
        </div>
        <div style="display: grid; gap: 6px;">
          <div><strong>Model:</strong> ${vehicle.model}</div>
          <div><strong>Brand:</strong> ${vehicle.brand}</div>
          <div><strong>Speed:</strong> ${position.speed || 0} km/h</div>
          <div><strong>Direction:</strong> ${position.heading || 0}°</div>
          <div><strong>Coordinates:</strong><br>
            &nbsp;&nbsp;Lat: ${position.latitude.toFixed(6)}<br>
            &nbsp;&nbsp;Lng: ${position.longitude.toFixed(6)}
          </div>
          <div style="font-size: 11px; color: #666; margin-top: 8px; padding-top: 8px; border-top: 1px solid #eee;">
            <strong>Last Update:</strong><br>
            ${this.formatDate(position.timestamp)}
          </div>
        </div>
      </div>
    `;

    marker.bindPopup(popupContent, {
      closeButton: true,
      autoClose: false,
      closeOnClick: false,
    });

    this.markers.push(marker);
  }

  private getStatusColor(status: string): string {
    const normalizedStatus = status?.toLowerCase().trim() || 'unknown';

    if (this.statusColorMap[normalizedStatus]) {
      return this.statusColorMap[normalizedStatus];
    }

    for (const [key, color] of Object.entries(this.statusColorMap)) {
      if (normalizedStatus.includes(key)) {
        return color;
      }
    }

    return this.statusColorMap['default'];
  }

  private clearMarkers(): void {
    const openPopups: Array<{ content: string; latlng: L.LatLng }> = [];

    this.markers.forEach((marker) => {
      if (marker.isPopupOpen()) {
        const popup = marker.getPopup();
        if (popup) {
          openPopups.push({
            content: popup.getContent() as string,
            latlng: marker.getLatLng(),
          });
        }
      }
      this.map.removeLayer(marker);
    });

    this.markers = [];

    setTimeout(() => {
      openPopups.forEach((popupData) => {
        L.popup({
          closeButton: true,
          autoClose: false,
          closeOnClick: false,
        })
          .setLatLng(popupData.latlng)
          .setContent(popupData.content)
          .openOn(this.map);
      });
    }, 100);
  }

  private formatDate(date: Date | string | number): string {
    return new Date(date).toLocaleString('en-EN', {
      month: '2-digit',
      day: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  }

  private normalizeStatus(s: string): string {
    const v = (s ?? '').toLowerCase().trim();
    if (v === 'online') return 'active';
    if (v === 'offline') return 'inactive';
    return v;
  }
  //bottone di aggiornamento manuale delle posizioni
  public refreshAllVehicles(): void {
    console.log('[GENERAL-MAP] Manual refresh triggered');

    const mqttPositions = this.mqttService.getAllPositions();
    console.log(`[GENERAL-MAP] MQTT cache contains ${mqttPositions.length} positions`);

    this.loadVehicles();
    this.showToastNotification(`Refreshing vehicles (${mqttPositions.length})`, 'success');
  }

  private showToastNotification(
    message: string,
    type: 'success' | 'error',
    duration: number = 3000
  ): void {
    this.toastMessage.set(message);
    this.toastType.set(type);
    this.showToast.set(true);

    setTimeout(() => {
      this.hideToastNotification();
    }, duration);
  }

  hideToastNotification(): void {
    this.showToast.set(false);
  }

  public getVehiclesWithPosition(): number {
    return this.vehicleList().filter(
      (vehicle) =>
        vehicle.lastPosition && vehicle.lastPosition.latitude && vehicle.lastPosition.longitude
    ).length;
  }

  public getVehiclesOnline(): number {
    return this.vehicleList().filter((v) => this.normalizeStatus(v.status) === 'active').length;
  }

  public getVehiclesOffline(): number {
    return this.vehicleList().filter((v) => this.normalizeStatus(v.status) === 'inactive').length;
  }

  public getVehiclesMaintenance(): number {
    return this.vehicleList().filter((vehicle) => {
      const status = vehicle.status?.toLowerCase().trim() || '';
      return status === 'maintenance';
    }).length;
  }

  goBack(): void {
    this.router.navigate(['/vehicle-list']);
  }
}
