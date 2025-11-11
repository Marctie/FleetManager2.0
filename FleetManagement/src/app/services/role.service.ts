import { Injectable, inject } from '@angular/core';
import { AuthService } from './auth.service';

// Enum dei ruoli disponibili
export enum UserRole {
  Administrator = 'Administrator',
  FleetManager = 'Fleet Manager',
  Driver = 'Driver',
  Viewer = 'Viewer',
}

// Enum dei permessi granulari
export enum Permission {
  // Veicoli
  VEHICLES_VIEW = 'vehicles.view',
  VEHICLES_CREATE = 'vehicles.create',
  VEHICLES_EDIT = 'vehicles.edit',
  VEHICLES_DELETE = 'vehicles.delete',
  VEHICLES_CHANGE_STATUS = 'vehicles.changeStatus',

  // Utenti
  USERS_VIEW = 'users.view',
  USERS_CREATE = 'users.create',
  USERS_EDIT = 'users.edit',
  USERS_DELETE = 'users.delete',

  // Documenti
  DOCUMENTS_VIEW = 'documents.view',
  DOCUMENTS_UPLOAD = 'documents.upload',
  DOCUMENTS_DOWNLOAD = 'documents.download',
  DOCUMENTS_DELETE = 'documents.delete',

  // Report e Dashboard
  REPORTS_VIEW = 'reports.view',
  DASHBOARD_VIEW = 'dashboard.view',

  // Mappa
  MAP_VIEW = 'map.view',

  // Telemetria
  TELEMETRY_VIEW = 'telemetry.view',
  TELEMETRY_VIEW_OWN = 'telemetry.view.own', // Solo proprio veicolo (Driver)

  // Assegnazioni
  ASSIGNMENTS_VIEW = 'assignments.view',
  ASSIGNMENTS_MANAGE = 'assignments.manage',
}

@Injectable({
  providedIn: 'root',
})
export class RoleService {
  private authService = inject(AuthService);

  // Mappa dei permessi per ogni ruolo
  private rolePermissions: Record<string, Permission[]> = {
    [UserRole.Administrator]: [
      // Accesso completo
      Permission.VEHICLES_VIEW,
      Permission.VEHICLES_CREATE,
      Permission.VEHICLES_EDIT,
      Permission.VEHICLES_DELETE,
      Permission.VEHICLES_CHANGE_STATUS,
      Permission.USERS_VIEW,
      Permission.USERS_CREATE,
      Permission.USERS_EDIT,
      Permission.USERS_DELETE,
      Permission.DOCUMENTS_VIEW,
      Permission.DOCUMENTS_UPLOAD,
      Permission.DOCUMENTS_DOWNLOAD,
      Permission.DOCUMENTS_DELETE,
      Permission.REPORTS_VIEW,
      Permission.DASHBOARD_VIEW,
      Permission.MAP_VIEW,
      Permission.TELEMETRY_VIEW,
      Permission.ASSIGNMENTS_VIEW,
      Permission.ASSIGNMENTS_MANAGE,
    ],
    [UserRole.FleetManager]: [
      // Gestione operativa (no delete veicoli, no gestione utenti)
      Permission.VEHICLES_VIEW,
      Permission.VEHICLES_CREATE,
      Permission.VEHICLES_EDIT,
      Permission.VEHICLES_CHANGE_STATUS,
      Permission.DOCUMENTS_VIEW,
      Permission.DOCUMENTS_UPLOAD,
      Permission.DOCUMENTS_DOWNLOAD,
      Permission.REPORTS_VIEW,
      Permission.DASHBOARD_VIEW,
      Permission.MAP_VIEW,
      Permission.TELEMETRY_VIEW, // Telemetria real-time
      Permission.ASSIGNMENTS_VIEW,
      Permission.ASSIGNMENTS_MANAGE,
    ],
    [UserRole.Driver]: [
      // Solo visualizzazione e gestione proprio veicolo
      Permission.VEHICLES_VIEW,
      Permission.VEHICLES_CHANGE_STATUS, // Solo per proprio veicolo
      Permission.DOCUMENTS_VIEW,
      Permission.DOCUMENTS_UPLOAD, // Solo propri documenti
      Permission.DOCUMENTS_DOWNLOAD, // Download propri documenti
      Permission.TELEMETRY_VIEW_OWN, // Telemetria solo proprio veicolo
      Permission.ASSIGNMENTS_VIEW,
    ],
    [UserRole.Viewer]: [
      // Solo visualizzazione (sola lettura completa)
      Permission.VEHICLES_VIEW,
      Permission.DOCUMENTS_VIEW,
      Permission.DOCUMENTS_DOWNLOAD, // Può scaricare documenti
      Permission.REPORTS_VIEW,
      Permission.DASHBOARD_VIEW,
      Permission.MAP_VIEW,
      Permission.TELEMETRY_VIEW, // Visualizzazione telemetria
      Permission.ASSIGNMENTS_VIEW,
    ],
  };

  /**
   * Ottiene il ruolo dell'utente corrente
   */
  getCurrentUserRole(): string | null {
    const user = this.authService.getCurrentUser();
    const role = user?.role || null;
    console.log('[RoleService] Getting current user role:', role, 'user:', user);
    return role;
  }

  /**
   * Verifica se l'utente ha un permesso specifico
   */
  hasPermission(permission: Permission): boolean {
    const role = this.getCurrentUserRole();
    if (!role) {
      console.log('[RoleService] No role found for permission check:', permission);
      return false;
    }

    const permissions = this.rolePermissions[role] || [];
    const hasPermission = permissions.includes(permission);
    console.log('[RoleService] Checking permission:', {
      role,
      permission,
      hasPermission,
      totalPermissions: permissions.length,
    });
    return hasPermission;
  }

  /**
   * Verifica se l'utente ha TUTTI i permessi specificati
   */
  hasAllPermissions(permissions: Permission[]): boolean {
    return permissions.every((permission) => this.hasPermission(permission));
  }

  /**
   * Verifica se l'utente ha ALMENO UNO dei permessi specificati
   */
  hasAnyPermission(permissions: Permission[]): boolean {
    return permissions.some((permission) => this.hasPermission(permission));
  }

  /**
   * Verifica se l'utente è Administrator
   */
  isAdministrator(): boolean {
    return this.getCurrentUserRole() === UserRole.Administrator;
  }

  /**
   * Verifica se l'utente è Fleet Manager
   */
  isFleetManager(): boolean {
    return this.getCurrentUserRole() === UserRole.FleetManager;
  }

  /**
   * Verifica se l'utente è Driver
   */
  isDriver(): boolean {
    return this.getCurrentUserRole() === UserRole.Driver;
  }

  /**
   * Verifica se l'utente è Viewer
   */
  isViewer(): boolean {
    return this.getCurrentUserRole() === UserRole.Viewer;
  }

  /**
   * Ottiene tutti i ruoli disponibili
   */
  getAvailableRoles(): string[] {
    return Object.values(UserRole);
  }

  /**
   * Ottiene i permessi per un ruolo specifico
   */
  getPermissionsForRole(role: string): Permission[] {
    return this.rolePermissions[role] || [];
  }

  /**
   * Verifica se può gestire gli utenti
   */
  canManageUsers(): boolean {
    return this.hasPermission(Permission.USERS_VIEW);
  }

  /**
   * Verifica se può eliminare veicoli
   */
  canDeleteVehicles(): boolean {
    return this.hasPermission(Permission.VEHICLES_DELETE);
  }

  /**
   * Verifica se può creare veicoli
   */
  canCreateVehicles(): boolean {
    return this.hasPermission(Permission.VEHICLES_CREATE);
  }

  /**
   * Verifica se può gestire le assegnazioni veicoli
   */
  canManageAssignments(): boolean {
    return this.hasPermission(Permission.ASSIGNMENTS_MANAGE);
  }
}
