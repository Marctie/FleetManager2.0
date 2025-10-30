export interface IAppConfig {
  apiConfig: {
    baseUrl: string;
    timeout: number;
    retryAttempts: number;
  };
  endpoints: {
    auth: {
      login: string;
      refresh: string;
      logout: string;
    };
    vehicles: {
      getAll: string;
      getById: string;
      create: string;
      update: string;
      delete: string;
      updateStatus: string;
      assignDriver: string;
    };
    telemetry: {
      getByVehicle: string;
      getLatest: string;
      getFleetLocations: string;
      create: string;
    };
    assignments: {
      getAll: string;
      create: string;
      getByDriver: string;
      getByVehicle: string;
      complete: string;
    };
    users: {
      getAll: string;
      getById: string;
      create: string;
      update: string;
      delete: string;
    };
    documents: {
      getByVehicle: string;
      create: string;
      getById: string;
      delete: string;
    };
    reports: {
      fleetSummary: string;
      maintenanceDue: string;
    };
  };
  enums: {
    vehicleStatus: {
      available: number;
      inUse: number;
      maintenance: number;
      outOfService: number;
    };
    fuelType: {
      gasoline: number;
      diesel: number;
      electric: number;
      hybrid: number;
      lpg: number;
      cng: number;
    };
    userRole: {
      admin: number;
      manager: number;
      driver: number;
      viewer: number;
    };
    documentType: {
      insurance: number;
      registration: number;
      maintenance: number;
      inspection: number;
      contract: number;
      other: number;
    };
  };
  pagination: {
    defaultPageSize: number;
    maxPageSize: number;
  };
  maps: {
    defaultCenter: {
      lat: number;
      lng: number;
    };
    defaultZoom: number;
  };
  mqtt: {
    brokerUrl: string;
    keepalive: number;
    port: number;
    path: string;
    protocol: string;
    username: string;
    password: string;
    hostname: string;
    topics: {
      vehicles: string;
      fleet: string;
    };
  };
  realtime: {
    telemetryUpdateInterval: number;
    locationUpdateInterval: number;
  };
  notifications: {
    enabled: boolean;
    types: {
      maintenanceAlert: boolean;
      insuranceExpiry: boolean;
      assignmentComplete: boolean;
      lowFuel: boolean;
    };
  };
  features: {
    enableReports: boolean;
    enableDocuments: boolean;
    enableTelemetry: boolean;
    enableAssignments: boolean;
    enableNotifications: boolean;
  };
  cache: {
    enabled: boolean;
    ttl: number;
    vehiclesCacheTTL: number;
    telemetryCacheTTL: number;
  };
  dateFormat: {
    display: string;
    api: string;
    locale: string;
  };
  validation: {
    licensePlate: {
      pattern: string;
      message: string;
    };
    vin: {
      minLength: number;
      maxLength: number;
      message: string;
    };
  };
}
