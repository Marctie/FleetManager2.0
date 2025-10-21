import { Injectable, inject } from '@angular/core';
import { UserRole, Permission, ROLE_PERMISSIONS, UserInfo } from '../models/user-roles';

/**
 * Service per la gestione dei permessi utente
 * Controlla l'accesso alle funzionalità in base al ruolo
 */
@Injectable({
  providedIn: 'root',
})
export class PermissionService {
  /**
   * Verifica se un utente ha un permesso specifico
   */
  hasPermission(userRole: UserRole, permission: Permission): boolean {
    const rolePermissions = ROLE_PERMISSIONS[userRole];
    return rolePermissions.includes(permission);
  }

  /**
   * Verifica se un utente ha TUTTI i permessi specificati
   */
  hasAllPermissions(userRole: UserRole, permissions: Permission[]): boolean {
    return permissions.every((permission) => this.hasPermission(userRole, permission));
  }

  /**
   * Verifica se un utente ha ALMENO UNO dei permessi specificati
   */
  hasAnyPermission(userRole: UserRole, permissions: Permission[]): boolean {
    return permissions.some((permission) => this.hasPermission(userRole, permission));
  }

  /**
   * Ottiene tutti i permessi di un ruolo
   */
  getPermissionsForRole(userRole: UserRole): Permission[] {
    return ROLE_PERMISSIONS[userRole] || [];
  }

  /**
   * Verifica se l'utente può accedere ai dati di un veicolo
   * I DRIVER possono accedere solo al proprio veicolo assegnato
   */
  canAccessVehicle(user: UserInfo, vehicleId: number): boolean {
    // Administrator, Fleet Manager e Viewer possono accedere a tutti i veicoli
    if (
      user.role === UserRole.ADMINISTRATOR ||
      user.role === UserRole.FLEET_MANAGER ||
      user.role === UserRole.VIEWER
    ) {
      return true;
    }

    // Driver può accedere solo al proprio veicolo
    if (user.role === UserRole.DRIVER) {
      return user.assignedVehicleId === vehicleId;
    }

    // Guest non può accedere ai dettagli dei veicoli
    return false;
  }

  /**
   * Verifica se l'utente può modificare i dati di un veicolo
   */
  canEditVehicle(user: UserInfo, vehicleId: number): boolean {
    // Solo Administrator e Fleet Manager possono modificare i veicoli
    if (user.role === UserRole.ADMINISTRATOR || user.role === UserRole.FLEET_MANAGER) {
      return true;
    }

    return false;
  }

  /**
   * Verifica se l'utente può eliminare un veicolo
   * SOLO Administrator può eliminare veicoli
   */
  canDeleteVehicle(user: UserInfo): boolean {
    return user.role === UserRole.ADMINISTRATOR;
  }

  /**
   * Verifica se l'utente può cambiare lo stato di un veicolo
   */
  canChangeVehicleStatus(user: UserInfo, vehicleId: number): boolean {
    // Administrator e Fleet Manager possono cambiare stato di qualsiasi veicolo
    if (user.role === UserRole.ADMINISTRATOR || user.role === UserRole.FLEET_MANAGER) {
      return true;
    }

    // Driver può cambiare solo lo stato del proprio veicolo
    if (user.role === UserRole.DRIVER) {
      return user.assignedVehicleId === vehicleId;
    }

    return false;
  }

  /**
   * Verifica se l'utente può caricare documenti per un veicolo
   */
  canUploadDocuments(user: UserInfo, vehicleId: number): boolean {
    // Administrator e Fleet Manager possono caricare documenti per qualsiasi veicolo
    if (user.role === UserRole.ADMINISTRATOR || user.role === UserRole.FLEET_MANAGER) {
      return true;
    }

    // Driver può caricare documenti solo per il proprio veicolo
    if (user.role === UserRole.DRIVER) {
      return user.assignedVehicleId === vehicleId;
    }

    return false;
  }

  /**
   * Verifica se l'utente può eliminare documenti
   * SOLO Administrator può eliminare documenti
   */
  canDeleteDocuments(user: UserInfo): boolean {
    return user.role === UserRole.ADMINISTRATOR;
  }

  /**
   * Verifica se l'utente può gestire altri utenti
   * SOLO Administrator può gestire utenti
   */
  canManageUsers(user: UserInfo): boolean {
    return user.role === UserRole.ADMINISTRATOR;
  }

  /**
   * Verifica se l'utente può assegnare veicoli ai driver
   */
  canAssignVehicles(user: UserInfo): boolean {
    return user.role === UserRole.ADMINISTRATOR || user.role === UserRole.FLEET_MANAGER;
  }

  /**
   * Verifica se l'utente può visualizzare tutti i veicoli sulla mappa
   */
  canViewAllVehiclesOnMap(user: UserInfo): boolean {
    return (
      user.role === UserRole.ADMINISTRATOR ||
      user.role === UserRole.FLEET_MANAGER ||
      user.role === UserRole.VIEWER
    );
  }

  /**
   * Verifica se l'utente può accedere alle configurazioni di sistema
   */
  canAccessSystemConfig(user: UserInfo): boolean {
    return user.role === UserRole.ADMINISTRATOR;
  }

  /**
   * Verifica se l'utente può creare assegnazioni
   */
  canCreateAssignment(user: UserInfo): boolean {
    return user.role === UserRole.ADMINISTRATOR || user.role === UserRole.FLEET_MANAGER;
  }

  /**
   * Verifica se l'utente può eliminare assegnazioni
   * SOLO Administrator può eliminare assegnazioni
   */
  canDeleteAssignment(user: UserInfo): boolean {
    return user.role === UserRole.ADMINISTRATOR;
  }

  /**
   * Ottiene il messaggio di errore appropriato per permesso negato
   */
  getPermissionDeniedMessage(permission: Permission): string {
    const messages: Record<Permission, string> = {
      [Permission.VIEW_VEHICLES]: 'You do not have permission to view vehicles',
      [Permission.CREATE_VEHICLE]: 'You do not have permission to create vehicles',
      [Permission.EDIT_VEHICLE]: 'You do not have permission to edit vehicles',
      [Permission.DELETE_VEHICLE]: 'Only Administrators can delete vehicles',
      [Permission.ASSIGN_VEHICLE]: 'You do not have permission to assign vehicles',
      [Permission.CHANGE_VEHICLE_STATUS]: 'You do not have permission to change vehicle status',

      [Permission.VIEW_USERS]: 'You do not have permission to view users',
      [Permission.CREATE_USER]: 'Only Administrators can create users',
      [Permission.EDIT_USER]: 'Only Administrators can edit users',
      [Permission.DELETE_USER]: 'Only Administrators can delete users',

      [Permission.VIEW_DOCUMENTS]: 'You do not have permission to view documents',
      [Permission.UPLOAD_DOCUMENTS]: 'You do not have permission to upload documents',
      [Permission.DELETE_DOCUMENTS]: 'Only Administrators can delete documents',
      [Permission.DOWNLOAD_DOCUMENTS]: 'You do not have permission to download documents',

      [Permission.VIEW_ASSIGNMENTS]: 'You do not have permission to view assignments',
      [Permission.CREATE_ASSIGNMENT]: 'You do not have permission to create assignments',
      [Permission.EDIT_ASSIGNMENT]: 'You do not have permission to edit assignments',
      [Permission.DELETE_ASSIGNMENT]: 'Only Administrators can delete assignments',
      [Permission.COMPLETE_ASSIGNMENT]: 'You do not have permission to complete assignments',

      [Permission.VIEW_TELEMETRY]: 'You do not have permission to view telemetry',
      [Permission.VIEW_ALL_VEHICLES_MAP]: 'You do not have permission to view all vehicles on map',
      [Permission.VIEW_OWN_VEHICLE_MAP]: 'You do not have permission to view vehicle location',

      [Permission.VIEW_REPORTS]: 'You do not have permission to view reports',
      [Permission.VIEW_DASHBOARD]: 'You do not have permission to view dashboard',
      [Permission.VIEW_STATISTICS]: 'You do not have permission to view statistics',

      [Permission.MANAGE_SYSTEM_CONFIG]: 'Only Administrators can manage system configuration',
    };

    return messages[permission] || 'You do not have permission to perform this action';
  }
}
