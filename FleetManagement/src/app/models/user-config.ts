/**
 * Configurazione Utenti e Ruoli
 * Mapping tra username e ruoli assegnati
 */

import { UserRole } from './user-roles';

/**
 * Mappa degli utenti con i loro ruoli
 * Chiave: username (come arriva dall'API)
 * Valore: ruolo assegnato
 */
export const USER_ROLE_MAPPING: Record<string, UserRole> = {
  // ADMINISTRATOR - Accesso completo
  admin: UserRole.ADMINISTRATOR,

  // FLEET_MANAGER - Gestione operativa
  manager: UserRole.FLEET_MANAGER,

  // DRIVER - Accesso limitato al proprio veicolo
  driver1: UserRole.DRIVER,

  // VIEWER - Solo visualizzazione
  viewer: UserRole.VIEWER,
};

/**
 * Mapping tra ruoli API e ruoli applicazione
 * Alcuni backend potrebbero usare nomi diversi (es: "MANAGER" invece di "FLEET_MANAGER")
 */
export const API_ROLE_MAPPING: Record<string, UserRole> = {
  // Administrator
  ADMINISTRATOR: UserRole.ADMINISTRATOR,
  administrator: UserRole.ADMINISTRATOR,
  admin: UserRole.ADMINISTRATOR,
  ADMIN: UserRole.ADMINISTRATOR,

  // Fleet Manager
  FLEET_MANAGER: UserRole.FLEET_MANAGER,
  fleet_manager: UserRole.FLEET_MANAGER,
  MANAGER: UserRole.FLEET_MANAGER, // ⬅️ API potrebbe inviare "MANAGER"
  manager: UserRole.FLEET_MANAGER,
  Manager: UserRole.FLEET_MANAGER,

  // Driver
  DRIVER: UserRole.DRIVER,
  driver: UserRole.DRIVER,
  Driver: UserRole.DRIVER,

  // Viewer
  VIEWER: UserRole.VIEWER,
  viewer: UserRole.VIEWER,
  Viewer: UserRole.VIEWER,

  // Guest
  GUEST: UserRole.GUEST,
  guest: UserRole.GUEST,
  Guest: UserRole.GUEST,
};

/**
 * Ottiene il ruolo dell'utente in base allo username
 * @param username Username dell'utente
 * @returns Ruolo assegnato o VIEWER come default
 */
export function getRoleByUsername(username: string): UserRole {
  return USER_ROLE_MAPPING[username] || UserRole.VIEWER;
}

/**
 * Ottiene il ruolo dell'applicazione da un ruolo API
 * @param apiRole Ruolo come arriva dall'API
 * @returns Ruolo applicazione corrispondente
 */
export function mapApiRoleToAppRole(apiRole: string): UserRole {
  return API_ROLE_MAPPING[apiRole] || UserRole.VIEWER;
}

/**
 * Verifica se un username è un amministratore
 * @param username Username da verificare
 * @returns true se è admin
 */
export function isAdministrator(username: string): boolean {
  return getRoleByUsername(username) === UserRole.ADMINISTRATOR;
}

/**
 * Verifica se un username è un fleet manager
 * @param username Username da verificare
 * @returns true se è manager
 */
export function isFleetManager(username: string): boolean {
  return getRoleByUsername(username) === UserRole.FLEET_MANAGER;
}

/**
 * Verifica se un username è un driver
 * @param username Username da verificare
 * @returns true se è driver
 */
export function isDriver(username: string): boolean {
  return getRoleByUsername(username) === UserRole.DRIVER;
}

/**
 * Verifica se un username è un viewer
 * @param username Username da verificare
 * @returns true se è viewer
 */
export function isViewer(username: string): boolean {
  return getRoleByUsername(username) === UserRole.VIEWER;
}

/**
 * Ottiene tutti gli username con un determinato ruolo
 * @param role Ruolo da cercare
 * @returns Array di username con quel ruolo
 */
export function getUsernamesByRole(role: UserRole): string[] {
  return Object.entries(USER_ROLE_MAPPING)
    .filter(([_, userRole]) => userRole === role)
    .map(([username, _]) => username);
}

/**
 * Informazioni complete sugli utenti del sistema
 */
export interface UserConfig {
  username: string;
  role: UserRole;
  displayName: string;
  email?: string;
  assignedVehicleId?: number;
}

/**
 * Configurazione completa utenti con dati aggiuntivi
 */
export const USERS_CONFIG: UserConfig[] = [
  {
    username: 'admin',
    role: UserRole.ADMINISTRATOR,
    displayName: 'Administrator',
    email: 'admin@fleetmanagement.com',
  },
  {
    username: 'manager',
    role: UserRole.FLEET_MANAGER,
    displayName: 'Fleet Manager',
    email: 'manager@fleetmanagement.com',
  },
  {
    username: 'driver1',
    role: UserRole.DRIVER,
    displayName: 'Driver 1',
    email: 'driver1@fleetmanagement.com',
    // assignedVehicleId: 123, // ⬅️ Da configurare quando disponibile
  },
  {
    username: 'viewer',
    role: UserRole.VIEWER,
    displayName: 'Viewer',
    email: 'viewer@fleetmanagement.com',
  },
];

/**
 * Ottiene la configurazione completa di un utente
 * @param username Username dell'utente
 * @returns Configurazione utente o null
 */
export function getUserConfig(username: string): UserConfig | null {
  return USERS_CONFIG.find((u) => u.username === username) || null;
}
