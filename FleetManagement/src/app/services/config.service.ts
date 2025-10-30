import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { IAppConfig } from '../models/IAppConfig';

@Injectable({
  providedIn: 'root',
})
export class ConfigService {
  private configSubject = new BehaviorSubject<IAppConfig | null>(null);
  public config$ = this.configSubject.asObservable();

  private defaultConfig: IAppConfig = {
    apiConfig: {
      baseUrl: 'http://10.0.90.9/Stage/FleetManagement',
      timeout: 30000,
      retryAttempts: 3,
    },
    endpoints: {
      auth: {
        login: '/api/Auth/login',
        refresh: '/api/Auth/refresh',
        logout: '/api/Auth/logout',
      },
      vehicles: {
        getAll: '/api/Vehicles',
        getById: '/api/Vehicles/{id}',
        create: '/api/Vehicles',
        update: '/api/Vehicles/{id}',
        delete: '/api/Vehicles/{id}',
        updateStatus: '/api/Vehicles/{id}/status',
        assignDriver: '/api/Vehicles/{id}/assign',
      },
      users: {
        getAll: '/api/Users',
        getById: '/api/Users/{id}',
        create: '/api/Users',
        update: '/api/Users/{id}',
        delete: '/api/Users/{id}',
      },
      telemetry: {
        getByVehicle: '',
        getLatest: '',
        getFleetLocations: '',
        create: '',
      },
      assignments: {
        getAll: '',
        create: '',
        getByDriver: '',
        getByVehicle: '',
        complete: '',
      },
      documents: {
        getByVehicle: '',
        create: '',
        getById: '',
        delete: '',
      },
      reports: {
        fleetSummary: '',
        maintenanceDue: '',
      },
    },
    enums: {
      vehicleStatus: {
        available: 0,
        inUse: 1,
        maintenance: 2,
        outOfService: 3,
      },
      fuelType: {
        gasoline: 0,
        diesel: 1,
        electric: 2,
        hybrid: 3,
        lpg: 4,
        cng: 5,
      },
      userRole: {
        admin: 0,
        manager: 1,
        driver: 2,
        viewer: 3,
      },
      documentType: {
        insurance: 0,
        registration: 1,
        maintenance: 2,
        inspection: 3,
        contract: 4,
        other: 5,
      },
    },
    pagination: {
      defaultPageSize: 20,
      maxPageSize: 100,
    },
    maps: {
      defaultCenter: {
        lat: 41.9028,
        lng: 12.4964,
      },
      defaultZoom: 13,
    },
    mqtt: {
      brokerUrl: 'wss://rabbitmq.test.intellitronika.com/ws',
      keepalive: 120,
      port: 443,
      path: '/ws',
      protocol: 'wss',
      username: 'intellitronika',
      password: 'intellitronika',
      hostname: 'rabbitmq.test.intellitronika.com',
      topics: {
        vehicles: 'vehicles/#',
        fleet: 'fleet/#',
      },
    },
    features: {
      enableReports: true,
      enableDocuments: true,
      enableTelemetry: true,
      enableAssignments: true,
      enableNotifications: true,
    },
    dateFormat: {
      display: 'dd/MM/yyyy',
      api: 'yyyy-MM-ddTHH:mm:ss',
      locale: 'it-IT',
    },
    validation: {
      licensePlate: {
        pattern: '^[A-Z]{2}[0-9]{3}[A-Z]{2}$',
        message: 'Formato targa non valido (es. AB123CD)',
      },
      vin: {
        minLength: 17,
        maxLength: 17,
        message: 'Il VIN deve essere di 17 caratteri',
      },
    },
    realtime: {
      telemetryUpdateInterval: 0,
      locationUpdateInterval: 0,
    },
    notifications: {
      enabled: false,
      types: {
        maintenanceAlert: false,
        insuranceExpiry: false,
        assignmentComplete: false,
        lowFuel: false,
      },
    },
    cache: {
      enabled: false,
      ttl: 0,
      vehiclesCacheTTL: 0,
      telemetryCacheTTL: 0,
    },
  };

  constructor(private http: HttpClient) {}

  /**
   * Carica la configurazione dal file config.json
   */
  loadConfig(): Observable<IAppConfig> {
    return this.http.get<IAppConfig>('/assets/config.json').pipe(
      tap((config) => {
        console.log('[CONFIG-SERVICE] Configurazione caricata:', config);
        this.configSubject.next(config);
      }),
      catchError((error) => {
        console.error(
          '[CONFIG-SERVICE] Errore nel caricamento configurazione, uso default:',
          error
        );
        this.configSubject.next(this.defaultConfig);
        return of(this.defaultConfig);
      })
    );
  }

  /**
   * Ottieni la configurazione corrente
   */
  getConfig(): IAppConfig {
    const config = this.configSubject.value;
    if (!config) {
      console.warn('[CONFIG-SERVICE] Configurazione non ancora caricata, uso default');
      return this.defaultConfig;
    }
    return config;
  }

  /**
   * Ottieni l'URL base delle API
   */
  getApiBaseUrl(): string {
    return this.getConfig().apiConfig.baseUrl;
  }

  /**
   * Costruisci l'URL completo per un endpoint
   * @param section La sezione dell'endpoint (auth, vehicles, users, etc.)
   * @param endpoint Il nome specifico dell'endpoint
   * @param params I parametri da sostituire nell'URL (opzionale)
   */
  getApiUrl(
    section: keyof IAppConfig['endpoints'],
    endpoint: string,
    params?: { [key: string]: string | number }
  ): string {
    const config = this.getConfig();
    const baseUrl = config.apiConfig.baseUrl.endsWith('/')
      ? config.apiConfig.baseUrl.slice(0, -1)
      : config.apiConfig.baseUrl;

    let endpointPath =
      config.endpoints[section][endpoint as keyof (typeof config.endpoints)[typeof section]];

    const fullUrl = `${baseUrl}${endpointPath}`;
    console.log(`[CONFIG-SERVICE] URL costruito per ${section}.${endpoint}:`, fullUrl);
    return fullUrl;
  }

  /**
   * Ottieni le impostazioni di paginazione
   */
  getPaginationConfig() {
    return this.getConfig().pagination;
  }

  /**
   * Ottieni la configurazione della mappa
   */
  getMapConfig() {
    return this.getConfig().maps;
  }

  /**

  /**
   * Ottieni il formato delle date
   */
  getDateFormat() {
    return this.getConfig().dateFormat;
  }

  /**
   * Ottieni le regole di validazione
   */
  getValidation() {
    return this.getConfig().validation;
  }

  /**
   * Verifica se una feature è abilitata
   */
  isFeatureEnabled(feature: keyof IAppConfig['features']): boolean {
    const config = this.getConfig();
    return config.features[feature] as boolean;
  }

  /**
   * Ricarica la configurazione (utile per hot-reload)
   */
  reloadConfig(): Observable<IAppConfig> {
    console.log('[CONFIG-SERVICE] Ricaricamento configurazione...');
    return this.loadConfig();
  }

  /**
   * Aggiorna una specifica proprietà della configurazione (per testing)
   */
  updateConfig(updates: Partial<IAppConfig>): void {
    const currentConfig = this.getConfig();
    const newConfig = { ...currentConfig, ...updates };
    this.configSubject.next(newConfig);
    console.log('[CONFIG-SERVICE] Configurazione aggiornata:', newConfig);
  }
}
