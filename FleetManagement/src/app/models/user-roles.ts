/**
 * Definizione ruoli utente e permessi
 * Sistema di autorizzazione basato su ruoli (RBAC - Role-Based Access Control)
 */

/**
 * Enum dei ruoli disponibili nel sistema
 */
export enum UserRole {
  ADMINISTRATOR = 'ADMINISTRATOR',
  FLEET_MANAGER = 'FLEET_MANAGER',
  DRIVER = 'DRIVER',
  VIEWER = 'VIEWER',
  GUEST = 'GUEST', // Ruolo per accesso ospite (limitato)
}

/**
 * Enum delle azioni/permessi disponibili
 */
export enum Permission {
  // Veicoli
  VIEW_VEHICLES = 'VIEW_VEHICLES',
  CREATE_VEHICLE = 'CREATE_VEHICLE',
  EDIT_VEHICLE = 'EDIT_VEHICLE',
  DELETE_VEHICLE = 'DELETE_VEHICLE',
  ASSIGN_VEHICLE = 'ASSIGN_VEHICLE',
  CHANGE_VEHICLE_STATUS = 'CHANGE_VEHICLE_STATUS',

  // Utenti
  VIEW_USERS = 'VIEW_USERS',
  CREATE_USER = 'CREATE_USER',
  EDIT_USER = 'EDIT_USER',
  DELETE_USER = 'DELETE_USER',

  // Documenti
  VIEW_DOCUMENTS = 'VIEW_DOCUMENTS',
  UPLOAD_DOCUMENTS = 'UPLOAD_DOCUMENTS',
  DELETE_DOCUMENTS = 'DELETE_DOCUMENTS',
  DOWNLOAD_DOCUMENTS = 'DOWNLOAD_DOCUMENTS',

  // Assegnazioni
  VIEW_ASSIGNMENTS = 'VIEW_ASSIGNMENTS',
  CREATE_ASSIGNMENT = 'CREATE_ASSIGNMENT',
  EDIT_ASSIGNMENT = 'EDIT_ASSIGNMENT',
  DELETE_ASSIGNMENT = 'DELETE_ASSIGNMENT',
  COMPLETE_ASSIGNMENT = 'COMPLETE_ASSIGNMENT',

  // Telemetria e Mappe
  VIEW_TELEMETRY = 'VIEW_TELEMETRY',
  VIEW_ALL_VEHICLES_MAP = 'VIEW_ALL_VEHICLES_MAP',
  VIEW_OWN_VEHICLE_MAP = 'VIEW_OWN_VEHICLE_MAP',

  // Report e Dashboard
  VIEW_REPORTS = 'VIEW_REPORTS',
  VIEW_DASHBOARD = 'VIEW_DASHBOARD',
  VIEW_STATISTICS = 'VIEW_STATISTICS',

  // Configurazione
  MANAGE_SYSTEM_CONFIG = 'MANAGE_SYSTEM_CONFIG',
}

/**
 * Mappa dei permessi per ogni ruolo
 */
export const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  // ADMINISTRATOR: Accesso completo a tutto
  [UserRole.ADMINISTRATOR]: [
    // Veicoli
    Permission.VIEW_VEHICLES,
    Permission.CREATE_VEHICLE,
    Permission.EDIT_VEHICLE,
    Permission.DELETE_VEHICLE,
    Permission.ASSIGN_VEHICLE,
    Permission.CHANGE_VEHICLE_STATUS,

    // Utenti
    Permission.VIEW_USERS,
    Permission.CREATE_USER,
    Permission.EDIT_USER,
    Permission.DELETE_USER,

    // Documenti
    Permission.VIEW_DOCUMENTS,
    Permission.UPLOAD_DOCUMENTS,
    Permission.DELETE_DOCUMENTS,
    Permission.DOWNLOAD_DOCUMENTS,

    // Assegnazioni
    Permission.VIEW_ASSIGNMENTS,
    Permission.CREATE_ASSIGNMENT,
    Permission.EDIT_ASSIGNMENT,
    Permission.DELETE_ASSIGNMENT,
    Permission.COMPLETE_ASSIGNMENT,

    // Telemetria
    Permission.VIEW_TELEMETRY,
    Permission.VIEW_ALL_VEHICLES_MAP,
    Permission.VIEW_OWN_VEHICLE_MAP,

    // Report
    Permission.VIEW_REPORTS,
    Permission.VIEW_DASHBOARD,
    Permission.VIEW_STATISTICS,

    // Config
    Permission.MANAGE_SYSTEM_CONFIG,
  ],

  // FLEET_MANAGER: Gestione operativa (no eliminazione veicoli, no gestione utenti)
  [UserRole.FLEET_MANAGER]: [
    // Veicoli
    Permission.VIEW_VEHICLES,
    Permission.CREATE_VEHICLE,
    Permission.EDIT_VEHICLE,
    // NO DELETE_VEHICLE
    Permission.ASSIGN_VEHICLE,
    Permission.CHANGE_VEHICLE_STATUS,

    // NO gestione utenti

    // Documenti
    Permission.VIEW_DOCUMENTS,
    Permission.UPLOAD_DOCUMENTS,
    Permission.DOWNLOAD_DOCUMENTS,
    // NO DELETE_DOCUMENTS (solo visualizzazione e upload)

    // Assegnazioni
    Permission.VIEW_ASSIGNMENTS,
    Permission.CREATE_ASSIGNMENT,
    Permission.EDIT_ASSIGNMENT,
    Permission.COMPLETE_ASSIGNMENT,
    // NO DELETE_ASSIGNMENT

    // Telemetria
    Permission.VIEW_TELEMETRY,
    Permission.VIEW_ALL_VEHICLES_MAP,

    // Report
    Permission.VIEW_REPORTS,
    Permission.VIEW_DASHBOARD,
    Permission.VIEW_STATISTICS,
  ],

  // DRIVER: Accesso limitato al proprio veicolo
  [UserRole.DRIVER]: [
    // Veicoli (visualizzazione limitata)
    Permission.VIEW_VEHICLES, // Può vedere la lista ma con limitazioni
    // NO CREATE/EDIT/DELETE veicoli
    Permission.CHANGE_VEHICLE_STATUS, // Solo per il proprio veicolo

    // Documenti (solo proprio veicolo)
    Permission.VIEW_DOCUMENTS,
    Permission.UPLOAD_DOCUMENTS, // Report danni, ricevute
    Permission.DOWNLOAD_DOCUMENTS,

    // Assegnazioni (solo proprie)
    Permission.VIEW_ASSIGNMENTS,

    // Telemetria (solo proprio veicolo)
    Permission.VIEW_TELEMETRY,
    Permission.VIEW_OWN_VEHICLE_MAP,

    // Dashboard personale
    Permission.VIEW_DASHBOARD,
  ],

  // VIEWER: Solo visualizzazione (nessuna modifica)
  [UserRole.VIEWER]: [
    // Solo visualizzazione
    Permission.VIEW_VEHICLES,
    Permission.VIEW_DOCUMENTS,
    Permission.DOWNLOAD_DOCUMENTS,
    Permission.VIEW_ASSIGNMENTS,
    Permission.VIEW_TELEMETRY,
    Permission.VIEW_ALL_VEHICLES_MAP,
    Permission.VIEW_REPORTS,
    Permission.VIEW_DASHBOARD,
    Permission.VIEW_STATISTICS,
  ],

  // GUEST: Accesso molto limitato (modalità ospite)
  [UserRole.GUEST]: [
    Permission.VIEW_DASHBOARD, // Solo dashboard base
    Permission.VIEW_VEHICLES, // Lista veicoli limitata
  ],
};

/**
 * Interfaccia per le informazioni dell'utente con ruolo
 */
export interface UserInfo {
  id: number;
  username: string;
  email?: string;
  role: UserRole;
  assignedVehicleId?: number; // Per i DRIVER: ID del veicolo assegnato
  firstName?: string;
  lastName?: string;
  createdAt?: Date;
}

/**
 * Configurazione UI per ogni ruolo (personalizzazione dashboard)
 */
export interface RoleConfig {
  role: UserRole;
  displayName: string;
  description: string;
  color: string; // Per badge UI
  icon: string; // Per visualizzazione UI
  homeRoute: string; // Rotta predefinita dopo login
}

export const ROLE_CONFIGS: Record<UserRole, RoleConfig> = {
  [UserRole.ADMINISTRATOR]: {
    role: UserRole.ADMINISTRATOR,
    displayName: 'Administrator',
    description: 'Full system access with all permissions',
    color: '#e53e3e', // Rosso
    icon: 'shield-check',
    homeRoute: '/home',
  },
  [UserRole.FLEET_MANAGER]: {
    role: UserRole.FLEET_MANAGER,
    displayName: 'Fleet Manager',
    description: 'Fleet operations management',
    color: '#3182ce', // Blu
    icon: 'briefcase',
    homeRoute: '/home',
  },
  [UserRole.DRIVER]: {
    role: UserRole.DRIVER,
    displayName: 'Driver',
    description: 'Limited access to assigned vehicle',
    color: '#38a169', // Verde
    icon: 'user',
    homeRoute: '/vehicles/dashboard',
  },
  [UserRole.VIEWER]: {
    role: UserRole.VIEWER,
    displayName: 'Viewer',
    description: 'Read-only access to all data',
    color: '#805ad5', // Viola
    icon: 'eye',
    homeRoute: '/home',
  },
  [UserRole.GUEST]: {
    role: UserRole.GUEST,
    displayName: 'Guest',
    description: 'Temporary limited access',
    color: '#718096', // Grigio
    icon: 'user-circle',
    homeRoute: '/home',
  },
};
