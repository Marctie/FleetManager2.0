import { Injectable, signal, computed } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { Client, Message } from 'paho-mqtt';

// Interfaccia per i messaggi MQTT
export interface MqttMessage {
  topic: string;
  payload: any;
  timestamp: Date;
}

// Interfaccia per le posizioni dei veicoli ricevute via MQTT (modello esatto)
export interface VehiclePositionUpdate {
  vehicleId: number | string; // Può essere numero o GUID
  latitude: number;
  longitude: number;
  speed: number;
  heading: number;
  timestamp: Date;
  status?: string;
  deviceIdentifier?: string; // GUID del dispositivo
}

@Injectable({
  providedIn: 'root',
})
export class MqttService {
  private client: Client | null = null;
  private messageSubject = new Subject<MqttMessage>();
  private connectionStatus = new Subject<boolean>();
  private isEnabled = false; // Disabilitato di default

  // CACHE IN-MEMORY DELLE POSIZIONI MQTT
  private positionsMap = signal<Map<number | string, VehiclePositionUpdate>>(new Map());

  // COMPUTED: Lista di tutte le posizioni
  public positionVehiclesList = computed(() => {
    return Array.from(this.positionsMap().values());
  });

  // Configurazione broker MQTT
  private readonly MQTT_HOSTNAME = 'rabbitmq.test.intellitronika.com';
  private readonly MQTT_PORT = 443;
  private readonly MQTT_PATH = '/ws';
  private readonly MQTT_USERNAME = 'intellitronika';
  private readonly MQTT_PASSWORD = 'intellitronika';
  private readonly MQTT_USE_SSL = true;
  private readonly MQTT_CLIENT_ID = 'FleetManager_' + Math.random().toString(16).substring(2, 8);

  constructor() {
    console.log('[MQTT] Service initialized. Call enableAndConnect() to start connection.');
  }

  /**
   * Abilita e connette al broker MQTT
   */
  public enableAndConnect(): void {
    this.isEnabled = true;
    this.connect();
  }

  /**
   * Connessione al broker MQTT
   */
  private connect(): void {
    if (!this.isEnabled) {
      console.log('[MQTT] Service is disabled. Call enableAndConnect() to start.');
      return;
    }

    if (this.client && this.client.isConnected()) {
      console.log('[MQTT] Already connected');
      return;
    }

    try {
      console.log('[MQTT] Connecting to broker:', this.MQTT_HOSTNAME);

      // Crea il client Paho MQTT
      this.client = new Client(
        this.MQTT_HOSTNAME,
        this.MQTT_PORT,
        this.MQTT_PATH,
        this.MQTT_CLIENT_ID
      );

      // Callback quando arriva un messaggio
      this.client.onMessageArrived = (message: Message) => {
        try {
          const payload = JSON.parse(message.payloadString);

          // SALVA LA POSIZIONE NELLA CACHE
          this.ingestPositionMessage(payload);

          // Emetti anche il messaggio generico
          this.messageSubject.next({
            topic: message.destinationName,
            payload: payload,
            timestamp: new Date(),
          });
        } catch (error) {
          console.error('[MQTT] Error parsing message:', error, message.payloadString);
        }
      };

      // Callback quando si perde la connessione
      this.client.onConnectionLost = (responseObject) => {
        console.warn('[MQTT] Connection lost:', responseObject.errorMessage);
        this.connectionStatus.next(false);

        // Tentativo di riconnessione automatica
        if (responseObject.errorCode !== 0) {
          console.log('[MQTT] Attempting to reconnect...');
          setTimeout(() => this.connect(), 3000);
        }
      };

      // Opzioni di connessione
      const connectOptions = {
        onSuccess: () => {
          console.log('[MQTT] Connected successfully to broker');
          this.connectionStatus.next(true);

          // Sottoscrizione ai topic MQTT
          console.log('[MQTT] Subscribing to MQTT topics...');
          this.subscribeToTopic('intellitronika/+/status/+');
          this.subscribeToTopic('Vehicles/#');
          this.subscribeToTopic('vehicles/#');
        },
        onFailure: (error: any) => {
          console.error('[MQTT] Connection failed:', error.errorMessage);
          this.connectionStatus.next(false);
        },
        userName: this.MQTT_USERNAME,
        password: this.MQTT_PASSWORD,
        useSSL: this.MQTT_USE_SSL,
        keepAliveInterval: 120,
        cleanSession: true,
        reconnect: true,
      };

      // Connessione al broker
      this.client.connect(connectOptions);
    } catch (error) {
      console.error('[MQTT] Connection error:', error);
      this.connectionStatus.next(false);
    }
  }

  /**
   * Sottoscrizione a un topic specifico
   */
  private subscribeToTopic(topic: string): void {
    if (this.client && this.client.isConnected()) {
      this.client.subscribe(topic, {
        onSuccess: () => {
          console.log(`[MQTT] Successfully subscribed to topic: ${topic}`);
        },
        onFailure: (error: any) => {
          console.error(`[MQTT] Error subscribing to topic ${topic}:`, error.errorMessage);
        },
      });
    } else {
      console.warn('[MQTT] Cannot subscribe - connection not ready');
    }
  }

  /**
   * Observable per ricevere i messaggi MQTT
   */
  public getMessages(): Observable<MqttMessage> {
    return this.messageSubject.asObservable();
  }

  /**
   * Observable per ricevere solo gli aggiornamenti delle posizioni dei veicoli
   */
  public getVehiclePositionUpdates(): Observable<VehiclePositionUpdate> {
    return new Observable((observer) => {
      this.messageSubject.subscribe({
        next: (message) => {
          console.log('[MQTT] getVehiclePositionUpdates - Processing message');
          console.log('[MQTT] Topic:', message.topic);

          try {
            const payload = message.payload;
            console.log('[MQTT] Processing payload for vehicleId extraction:', {
              hasVehicleId: !!payload.vehicleId,
              hasId: !!payload.id,
              hasDeviceIdentifier: !!payload.deviceIdentifier,
              vehicleId: payload.vehicleId,
              id: payload.id,
              deviceIdentifier: payload.deviceIdentifier,
            });

            // CASO 1: Struttura nidificata { position: { latitude, longitude } }
            if (
              payload.position &&
              payload.position.latitude !== undefined &&
              payload.position.longitude !== undefined
            ) {
              // PRIORITA' 1: vehicleId numerico
              // PRIORITA' 2: id numerico
              // PRIORITA' 3: deviceIdentifier (GUID) come fallback
              const vehicleId = payload.vehicleId || payload.id || payload.deviceIdentifier;

              if (!vehicleId) {
                console.warn('[MQTT] Missing vehicleId in nested structure:', payload);
                return;
              }

              console.log(
                '[MQTT] Found nested position structure with vehicleId:',
                vehicleId,
                typeof vehicleId
              );

              const positionUpdate: VehiclePositionUpdate = {
                vehicleId: vehicleId,
                latitude: payload.position.latitude,
                longitude: payload.position.longitude,
                speed: payload.speed || payload.position.speed || 0,
                heading: payload.heading || payload.position.heading || 0,
                timestamp: payload.position.time
                  ? new Date(payload.position.time)
                  : payload.time
                  ? new Date(payload.time)
                  : new Date(),
                status: payload.status || 'unknown',
                deviceIdentifier: payload.deviceIdentifier, // Manteniamo per debug
              };
              observer.next(positionUpdate);
              return;
            }

            // CASO 2: Struttura flat { vehicleId, latitude, longitude }
            if (
              (payload.vehicleId || payload.id) &&
              payload.latitude !== undefined &&
              payload.longitude !== undefined
            ) {
              const vehicleId = payload.vehicleId || payload.id;

              const positionUpdate: VehiclePositionUpdate = {
                vehicleId: vehicleId,
                latitude: payload.latitude,
                longitude: payload.longitude,
                speed: payload.speed || 0,
                heading: payload.heading || 0,
                timestamp: payload.timestamp ? new Date(payload.timestamp) : new Date(),
                status: payload.status || 'unknown',
                deviceIdentifier: payload.deviceIdentifier,
              };

              observer.next(positionUpdate);
              return;
            }

            // Nessuna struttura valida
            console.log('[MQTT] No valid position structure in message');
          } catch (error) {
            console.error('[MQTT] Error processing vehicle position:', error, message);
          }
        },
        error: (error) => observer.error(error),
      });
    });
  }

  /**
   * SALVA LA POSIZIONE DEL VEICOLO NELLA CACHE IN-MEMORY
   */
  private ingestPositionMessage(payload: any): void {
    try {
      // CASO 1: Struttura nidificata con position: { latitude, longitude }
      if (
        payload.position &&
        payload.position.latitude !== undefined &&
        payload.position.longitude !== undefined
      ) {
        const vehicleId = payload.vehicleId || payload.id || payload.deviceIdentifier;

        if (!vehicleId) {
          console.warn('[MQTT] Missing vehicleId');
          return;
        }

        const position: VehiclePositionUpdate = {
          vehicleId: vehicleId,
          deviceIdentifier: payload.deviceIdentifier,
          latitude: payload.position.latitude,
          longitude: payload.position.longitude,
          speed: payload.speed || payload.position.speed || 0,
          heading: payload.heading || payload.position.heading || 0,
          timestamp: payload.position.time
            ? new Date(payload.position.time)
            : payload.time
            ? new Date(payload.time)
            : new Date(),
          status: payload.status,
        };

        // Aggiorna la mappa delle posizioni
        const currentMap = new Map(this.positionsMap());
        currentMap.set(vehicleId, position);
        this.positionsMap.set(currentMap);

        console.log(`[MQTT] Position cached for device ${vehicleId}`);
        return;
      }

      // CASO 2: Struttura flat con vehicleId, latitude, longitude
      if (
        (payload.vehicleId || payload.id) &&
        payload.latitude !== undefined &&
        payload.longitude !== undefined
      ) {
        console.log('[MQTT] Found flat position structure');

        const vehicleId = payload.vehicleId || payload.id;

        const position: VehiclePositionUpdate = {
          vehicleId: vehicleId,
          latitude: payload.latitude,
          longitude: payload.longitude,
          speed: payload.speed || 0,
          heading: payload.heading || 0,
          timestamp: payload.timestamp ? new Date(payload.timestamp) : new Date(),
          status: payload.status,
        };

        // Aggiorna la mappa delle posizioni
        const currentMap = new Map(this.positionsMap());
        currentMap.set(vehicleId, position);
        this.positionsMap.set(currentMap);

        console.log(`[MQTT] Position cached for vehicle ${vehicleId}`);
        console.log(`[MQTT] Cache now contains ${currentMap.size} positions`);
        return;
      }

      // Nessuna struttura valida trovata
      console.warn('[MQTT] No valid position structure found');
      console.warn('[MQTT] Payload keys:', Object.keys(payload));
    } catch (error) {
      console.error('[MQTT] Error ingesting position:', error, payload);
    }
  }

  /**
   * OTTIENI LA POSIZIONE DI UN VEICOLO SPECIFICO DALLA CACHE
   */
  public getVehiclePosition(vehicleId: number | string): VehiclePositionUpdate | undefined {
    return this.positionsMap().get(vehicleId);
  }

  /**
   * OTTIENI TUTTE LE POSIZIONI DALLA CACHE
   */
  public getAllPositions(): VehiclePositionUpdate[] {
    return Array.from(this.positionsMap().values());
  }

  /**
   * PULISCI LA CACHE DELLE POSIZIONI
   */
  public clearPositionsCache(): void {
    this.positionsMap.set(new Map());
    console.log('[MQTT] Positions cache cleared');
  }

  /**
   * DEBUG: Mostra lo stato della cache
   */
  public debugCacheStatus(): void {
    const positions = this.getAllPositions();
    console.log('=== MQTT CACHE STATUS ===');
    console.log('Total positions in cache:', positions.length);
    console.log(
      'Vehicle IDs:',
      positions.map((p) => p.vehicleId)
    );
    console.log('Full cache:', positions);
    console.log('========================');
  }

  /**
   * Observable per lo stato della connessione
   */
  public getConnectionStatus(): Observable<boolean> {
    return this.connectionStatus.asObservable();
  }

  /**
   * Chiude la connessione MQTT
   */
  public disconnect(): void {
    if (this.client && this.client.isConnected()) {
      this.client.disconnect();
      console.log('[MQTT] Disconnected');
      this.connectionStatus.next(false);
    }
    this.client = null;
  }

  /**
   * Verifica se la connessione è attiva
   */
  public isConnected(): boolean {
    return this.client !== null && this.client.isConnected();
  }
}
