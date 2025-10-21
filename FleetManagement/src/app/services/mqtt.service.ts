import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import mqtt from 'mqtt';
import { signal, computed } from '@angular/core';
import { VehiclePosition } from '../models/vehicle-position';

export interface VehicleStats {
  totalVehicles: number;
  movingVehicles: number;
  parkedVehicles: number;
  activeDrivers: number;
  maintenanceVehicles: number;
  gpsActive: number;
}

export interface VehicleLocation {
  vehicleId: string;
  latitude: number;
  longitude: number;
  speed: number;
  status: 'moving' | 'parked' | 'maintenance';
  driver: string;
  timestamp: string;
}

@Injectable({
  providedIn: 'root',
})
export class MqttService {
  private client: mqtt.MqttClient | null = null;
  private connected = false;

  // BehaviorSubjects for reactive data - inizializzati vuoti, valori solo da MQTT
  private vehicleStatsSubject = new BehaviorSubject<VehicleStats | null>(null);

  private vehicleLocationsSubject = new BehaviorSubject<VehicleLocation[]>([]);
  private connectionStatusSubject = new BehaviorSubject<boolean>(false);

  // Signals for positions and statuses (TrackingApp compatibility)
  private positionVeiclesListSignal = signal<VehiclePosition[]>([]);
  private statusByIdSignal = signal<Record<number, { status: string; timestamp: string | number }>>(
    {}
  );

  public vehicleStats$: Observable<VehicleStats | null> = this.vehicleStatsSubject.asObservable();
  public vehicleLocations$: Observable<VehicleLocation[]> =
    this.vehicleLocationsSubject.asObservable();
  public connectionStatus$: Observable<boolean> = this.connectionStatusSubject.asObservable();

  // MQTT Configuration - sarà caricata dinamicamente da config.json
  private mqttConfig: any = null;

  // Topics - Usa un unico topic con wildcard # per catturare tutti i messaggi
  private readonly TOPICS = {
    ALL_VEHICLES: 'fleet/vehicles/#',
  };

  constructor() {
    console.log('MQTT Service initialized');

    // CARICA CONFIGURAZIONE DINAMICA
    this.loadConfiguration().then(() => {
      // CARICA POSIZIONI DA LOCALSTORAGE (persistenza dopo refresh)
      this.loadPositionsFromLocalStorage();
    });
  }

  /**
   * Carica la configurazione MQTT dal file config.json
   */
  private async loadConfiguration(): Promise<void> {
    try {
      // Timeout per il fetch della configurazione
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Configuration load timeout')), 5000)
      );

      const fetchPromise = fetch('/assets/config.json').then((response) => response.json());

      const config = (await Promise.race([fetchPromise, timeoutPromise])) as any;

      if (config.mqtt) {
        this.mqttConfig = {
          brokerUrl: config.mqtt.brokerUrl,
          username: config.mqtt.username,
          password: config.mqtt.password,
          keepalive: config.mqtt.keepalive || 120,
          port: config.mqtt.port || 443,
          reconnectPeriod: 1000, // valore di default ragionevole
          connectTimeout: 30000, // valore di default ragionevole
        };
        console.log('MQTT configuration loaded from config.json:', this.mqttConfig);
      } else {
        console.error('MQTT configuration not found in config.json');
      }
    } catch (error) {
      console.error('Error loading MQTT configuration:', error);
      // Configurazione di fallback se il file non è disponibile
      this.mqttConfig = {
        brokerUrl: 'wss://rabbitmq.test.intellitronika.com/ws',
        username: 'intellitronika',
        password: 'intellitronika',
        keepalive: 120,
        port: 443,
        reconnectPeriod: 1000,
        connectTimeout: 30000,
      };
      console.log('Using fallback MQTT configuration');
    }
  }

  private async ensureConfigurationLoaded(): Promise<void> {
    if (!this.mqttConfig) {
      await this.loadConfiguration();
    }
  }

  async connect(): Promise<void> {
    if (this.connected) {
      console.log('Already connected to MQTT broker');
      return;
    }

    if (!this.mqttConfig) {
      console.log('Waiting for MQTT configuration to load...');
      await this.ensureConfigurationLoaded();
    }

    if (!this.mqttConfig) {
      console.error('MQTT configuration not loaded. Cannot connect.');
      return;
    }

    console.log('Connecting to MQTT broker:', this.mqttConfig.brokerUrl);

    try {
      this.client = mqtt.connect(this.mqttConfig.brokerUrl, {
        username: this.mqttConfig.username,
        password: this.mqttConfig.password,
        keepalive: this.mqttConfig.keepalive,
        reconnectPeriod: this.mqttConfig.reconnectPeriod,
        connectTimeout: this.mqttConfig.connectTimeout,
        clean: true,
        protocol: 'wss',
      });

      this.setupEventHandlers();
    } catch (error) {
      console.error('Error connecting to MQTT broker:', error);
      this.connectionStatusSubject.next(false);
    }
  }

  private setupEventHandlers(): void {
    if (!this.client) return;

    this.client.on('connect', () => {
      console.log('Connected to MQTT broker');
      this.connected = true;
      this.connectionStatusSubject.next(true);
      this.subscribeToTopics();
    });

    this.client.on('message', (topic: string, payload: Buffer) => {
      this.handleMessage(topic, payload);
    });

    this.client.on('error', (error) => {
      console.error('MQTT Error:', error);
      this.connectionStatusSubject.next(false);
    });

    this.client.on('close', () => {
      console.log('MQTT Connection closed');
      this.connected = false;
      this.connectionStatusSubject.next(false);
    });

    this.client.on('reconnect', () => {
      console.log('Reconnecting to MQTT broker...');
    });

    this.client.on('offline', () => {
      console.log('MQTT Client offline');
      this.connectionStatusSubject.next(false);
    });
  }

  private subscribeToTopics(): void {
    if (!this.client || !this.connected) return;

    // SUBSCRIBE A UN UNICO TOPIC
    const topic = this.TOPICS.ALL_VEHICLES;

    this.client.subscribe(topic, { qos: 1 }, (error) => {
      if (error) {
        console.error(`Error subscribing to ${topic}:`, error);
      } else {
        console.log(`Subscribed to topic: ${topic}`);
      }
    });

    // Request initial data
    this.requestInitialData();
  }

  /**
   * Gestisce tutti i messaggi da vehicles/#
   */
  private handleMessage(topic: string, payload: Buffer): void {
    try {
      const message = JSON.parse(payload.toString());
      console.log(`Received message on ${topic}:`, message);

      if (topic.includes('/status')) {
        this.updateVehicleStatus(message);
      } else if (topic.includes('/position')) {
        this.updateVehicleLocation(message);
      } else if (topic.includes('/stats')) {
        this.vehicleStatsSubject.next(message);
      } else {
        console.log(`Unknown topic pattern: ${topic}`);
      }
    } catch (error) {
      console.error('Error parsing MQTT message:', error);
    }
  }

  private updateVehicleStatus(statusMessage: any): void {
    const currentLocations = this.vehicleLocationsSubject.value;
    const updatedLocations = currentLocations.map((vehicle) =>
      vehicle.vehicleId === statusMessage.vehicleId ? { ...vehicle, ...statusMessage } : vehicle
    );
    this.vehicleLocationsSubject.next(updatedLocations);
  }

  private updateVehicleLocation(locationMessage: any): void {
    const currentLocations = this.vehicleLocationsSubject.value;
    const existingIndex = currentLocations.findIndex(
      (vehicle) => vehicle.vehicleId === locationMessage.vehicleId
    );

    if (existingIndex >= 0) {
      const updatedLocations = [...currentLocations];
      updatedLocations[existingIndex] = { ...updatedLocations[existingIndex], ...locationMessage };
      this.vehicleLocationsSubject.next(updatedLocations);
    } else {
      this.vehicleLocationsSubject.next([...currentLocations, locationMessage]);
    }
  }

  private requestInitialData(): void {
    if (!this.client || !this.connected) return;

    this.client.publish('fleet/request/stats', JSON.stringify({ request: 'initial_stats' }), {
      qos: 1,
    });
    this.client.publish(
      'fleet/request/locations',
      JSON.stringify({ request: 'initial_locations' }),
      { qos: 1 }
    );

    console.log('Requested initial data from MQTT broker');
  }

  publish(topic: string, message: any): void {
    if (!this.client || !this.connected) {
      console.warn('Cannot publish: Not connected to MQTT broker');
      return;
    }
    const payload = JSON.stringify(message);
    this.client.publish(topic, payload, { qos: 1 }, (error) => {
      if (error) {
        console.error(`Error publishing to ${topic}:`, error);
      } else {
        console.log(`Published to ${topic}:`, message);
      }
    });
  }

  /**
   * Disconnect
   */
  disconnect(): void {
    if (this.client && this.connected) {
      console.log('Disconnecting from MQTT broker...');
      this.client.end();
      this.connected = false;
      this.connectionStatusSubject.next(false);
    }
  }

  getCurrentStats(): VehicleStats | null {
    return this.vehicleStatsSubject.value;
  }

  getCurrentLocations(): VehicleLocation[] {
    return this.vehicleLocationsSubject.value;
  }

  isConnected(): boolean {
    return this.connected;
  }

  isConfigurationLoaded(): boolean {
    return this.mqttConfig !== null;
  }

  positionVeiclesList = computed(() => this.positionVeiclesListSignal());

  statusById = computed(() => this.statusByIdSignal());

  subscribeAndTrack(topic: string, callback: (message: any) => void): void {
    if (!this.client || !this.connected) {
      console.warn('Cannot subscribe: Not connected to MQTT broker');
      return;
    }

    this.client.subscribe(topic, { qos: 1 }, (error) => {
      if (error) {
        console.error(`Error subscribing to ${topic}:`, error);
      } else {
        console.log(`Subscribed to topic: ${topic}`);
      }
    });

    this.client.on('message', (receivedTopic: string, payload: Buffer) => {
      if (this.matchesTopic(topic, receivedTopic)) {
        callback({ topic: receivedTopic, payload });
      }
    });
  }

  private matchesTopic(pattern: string, topic: string): boolean {
    const patternParts = pattern.split('/');
    const topicParts = topic.split('/');

    if (patternParts.length !== topicParts.length) {
      return false;
    }

    for (let i = 0; i < patternParts.length; i++) {
      if (patternParts[i] === '+') continue;
      if (patternParts[i] === '#') return true;
      if (patternParts[i] !== topicParts[i]) return false;
    }

    return true;
  }

  /**
   * Salva anche in localStorage per persistenza
   */
  ingestStatusMessage(message: any): void {
    try {
      const payload = JSON.parse(message.payload.toString());
      const vehicleId = payload.vehicleId || this.extractVehicleIdFromTopic(message.topic);

      if (vehicleId) {
        const statusData = {
          status: payload.status || 'unknown',
          timestamp: payload.timestamp || Date.now(),
        };

        // 1. SALVA IN LOCALSTORAGE
        const vehicleKey = `vehicle_${vehicleId}_status`;
        localStorage.setItem(vehicleKey, JSON.stringify(statusData));

        // 2. AGGIORNA SIGNAL
        const currentStatuses = this.statusByIdSignal();
        this.statusByIdSignal.set({
          ...currentStatuses,
          [vehicleId]: statusData,
        });

        console.log(`Status updated for vehicle ${vehicleId}:`, payload.status);
      }
    } catch (error) {
      console.error('Error ingesting status message:', error);
    }
  }

  private extractVehicleIdFromTopic(topic: string): number | null {
    const match = topic.match(/vehicles\/(\d+)\//);
    return match ? parseInt(match[1]) : null;
  }

  ingestPositionMessage(message: any): void {
    try {
      const payload = JSON.parse(message.payload.toString());
      const vehicleId = payload.vehicleId || this.extractVehicleIdFromTopic(message.topic);

      if (vehicleId && payload.latitude && payload.longitude) {
        const position: VehiclePosition = {
          vehicleId,
          latitude: payload.latitude,
          longitude: payload.longitude,
          speed: payload.speed || 0,
          heading: payload.heading || 0,
          timestamp: payload.timestamp || Date.now(),
        };

        // 1. SALVA IN LOCALSTORAGE per persistenza (come TrackingApp)
        this.savePositionToLocalStorage(position);

        // 2. AGGIORNA SIGNAL per uso immediato
        const currentPositions = this.positionVeiclesListSignal();
        const existingIndex = currentPositions.findIndex((p) => p.vehicleId === vehicleId);

        if (existingIndex >= 0) {
          // Aggiorna posizione esistente
          const updatedPositions = [...currentPositions];
          updatedPositions[existingIndex] = position;
          this.positionVeiclesListSignal.set(updatedPositions);
        } else {
          // Aggiungi nuova posizione
          this.positionVeiclesListSignal.set([...currentPositions, position]);
        }

        console.log(`Position updated for vehicle ${vehicleId}`);
      }
    } catch (error) {
      console.error('Error ingesting position message:', error);
    }
  }

  /**
   * SALVA POSIZIONE IN LOCALSTORAGE (logica TrackingApp)
   * Mantiene persistenza anche dopo refresh pagina
   */
  private savePositionToLocalStorage(position: VehiclePosition): void {
    try {
      // 1. Salva posizione singola per veicolo specifico
      const vehicleKey = `vehicle_${position.vehicleId}_position`;
      localStorage.setItem(vehicleKey, JSON.stringify(position));

      // 2. Aggiorna lista generale
      const listKey = 'mqtt_vehicle_positions';
      const rawList = localStorage.getItem(listKey);
      let positionsList: VehiclePosition[] = rawList ? JSON.parse(rawList) : [];

      // Rimuove la posizione precedente dello stesso veicolo (evita duplicati)
      positionsList = positionsList.filter((p) => p.vehicleId !== position.vehicleId);

      // Aggiungi la nuova posizione
      positionsList.push(position);

      // Salva la lista aggiornata
      localStorage.setItem(listKey, JSON.stringify(positionsList));

      console.log(`Position saved to localStorage for vehicle ${position.vehicleId}`);
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
  }

  /**
   * CARICA POSIZIONI DA LOCALSTORAGE (al boot dell'app)
   * Ripristina le posizioni salvate dopo un refresh
   */
  loadPositionsFromLocalStorage(): void {
    try {
      const listKey = 'mqtt_vehicle_positions';
      const rawList = localStorage.getItem(listKey);

      if (rawList) {
        const positionsList: VehiclePosition[] = JSON.parse(rawList);
        this.positionVeiclesListSignal.set(positionsList);
        console.log(`Loaded ${positionsList.length} positions from localStorage`);
      } else {
        console.log('No positions found in localStorage');
      }

      // CARICA ANCHE GLI STATI
      this.loadStatusesFromLocalStorage();
    } catch (error) {
      console.error('Error loading from localStorage:', error);
    }
  }

  /**
   * CARICA STATI DA LOCALSTORAGE
   */
  private loadStatusesFromLocalStorage(): void {
    try {
      const statusKeys = Object.keys(localStorage).filter(
        (key) => key.startsWith('vehicle_') && key.endsWith('_status')
      );

      const statusesById: Record<number, { status: string; timestamp: string | number }> = {};

      statusKeys.forEach((key) => {
        const vehicleId = parseInt(key.replace('vehicle_', '').replace('_status', ''));
        const rawStatus = localStorage.getItem(key);
        if (rawStatus && !isNaN(vehicleId)) {
          statusesById[vehicleId] = JSON.parse(rawStatus);
        }
      });

      this.statusByIdSignal.set(statusesById);
      console.log(`Loaded ${Object.keys(statusesById).length} statuses from localStorage`);
    } catch (error) {
      console.error('Error loading statuses from localStorage:', error);
    }
  }

  /**
   * PULISCE LOCALSTORAGE (per reset/debug)
   */
  clearLocalStoragePositions(): void {
    try {
      localStorage.removeItem('mqtt_vehicle_positions');
      // Rimuove anche le posizioni singole
      Object.keys(localStorage)
        .filter((key) => key.startsWith('vehicle_') && key.endsWith('_position'))
        .forEach((key) => localStorage.removeItem(key));

      this.positionVeiclesListSignal.set([]);
      console.log('LocalStorage positions cleared');
    } catch (error) {
      console.error('Error clearing localStorage:', error);
    }
  }
}
