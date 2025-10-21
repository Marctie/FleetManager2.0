/**
 * Esempio di Routes con Sistema di Permessi implementato
 *
 * Questo file mostra come aggiornare app.routes.ts per usare
 * il sistema di ruoli e permessi.
 *
 * Copia questo contenuto in app.routes.ts quando pronto.
 */

import { Routes } from '@angular/router';
import { LoginComponent } from './login';
import { HomeComponent } from './features/home';
import { authGuard, guestGuard } from './features/auth/auth-guard';
import { permissionGuard, roleGuard } from './guards/permission.guard';
import { DashboardComponent } from './features/vehicles/dashboard';
import { VehicleListComponent } from './features/vehicles/vehicle-list.component';
import { VehicleDetailComponent } from './features/vehicles/vehicle-detail.component';
import { GeneralMapComponent } from './features/vehicles/general-map';
import { VehicleFormComponent } from './features/vehicles/vehicle-form.component';
import { UserManagementComponent } from './features/user-management.component';
import { AssociationsComponent } from './features/associations.component';
import { ReportsComponent } from './features/reports';
import { DocumentsComponent } from './features/documents';
import { Permission, UserRole } from './models/user-roles';

export const routes: Routes = [
  // ==================== PUBLIC ROUTES ====================
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  {
    path: 'login',
    component: LoginComponent,
    canActivate: [guestGuard],
  },

  // ==================== PROTECTED ROUTES ====================

  // HOME - Accessibile a tutti gli utenti autenticati
  {
    path: 'home',
    component: HomeComponent,
    canActivate: [authGuard],
  },

  // ==================== VEHICLES ROUTES ====================

  // DASHBOARD - Tutti possono vedere la dashboard
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [authGuard, permissionGuard],
    data: {
      permissions: [Permission.VIEW_DASHBOARD],
    },
  },

  // VEHICLE LIST - Tutti possono vedere la lista (con filtri basati sul ruolo)
  {
    path: 'vehicle-list',
    component: VehicleListComponent,
    canActivate: [authGuard, permissionGuard],
    data: {
      permissions: [Permission.VIEW_VEHICLES],
    },
  },

  // VEHICLE DETAIL - Tutti possono vedere i dettagli (con limitazioni per DRIVER)
  {
    path: 'vehicle-detail/:id',
    component: VehicleDetailComponent,
    canActivate: [authGuard, permissionGuard],
    data: {
      permissions: [Permission.VIEW_VEHICLES],
    },
  },

  // GENERAL MAP - Accessibile a tutti tranne GUEST
  {
    path: 'general-map',
    component: GeneralMapComponent,
    canActivate: [authGuard, permissionGuard],
    data: {
      permissions: [Permission.VIEW_ALL_VEHICLES_MAP, Permission.VIEW_OWN_VEHICLE_MAP],
      // Nota: Usa anyPermissions invece di permissions se vuoi accettare almeno uno
    },
  },

  // VEHICLE FORM (Create) - Solo ADMINISTRATOR e FLEET_MANAGER
  {
    path: 'vehicle-form/create',
    component: VehicleFormComponent,
    canActivate: [authGuard, permissionGuard],
    data: {
      permissions: [Permission.CREATE_VEHICLE],
    },
  },

  // VEHICLE FORM (Edit) - Solo ADMINISTRATOR e FLEET_MANAGER
  {
    path: 'vehicle-form/edit/:id',
    component: VehicleFormComponent,
    canActivate: [authGuard, permissionGuard],
    data: {
      permissions: [Permission.EDIT_VEHICLE],
    },
  },

  // ==================== USER MANAGEMENT ====================

  // USER MANAGEMENT - Solo ADMINISTRATOR
  {
    path: 'user-management',
    component: UserManagementComponent,
    canActivate: [authGuard, roleGuard],
    data: {
      roles: [UserRole.ADMINISTRATOR],
    },
  },

  // ==================== ASSIGNMENTS ====================

  // ASSOCIATIONS/ASSIGNMENTS - ADMINISTRATOR, FLEET_MANAGER e DRIVER (solo proprie)
  {
    path: 'associations',
    component: AssociationsComponent,
    canActivate: [authGuard, permissionGuard],
    data: {
      permissions: [Permission.VIEW_ASSIGNMENTS],
    },
  },

  // ==================== REPORTS ====================

  // REPORTS - Tutti tranne GUEST
  {
    path: 'reports',
    component: ReportsComponent,
    canActivate: [authGuard, permissionGuard],
    data: {
      permissions: [Permission.VIEW_REPORTS],
    },
  },

  // ==================== DOCUMENTS ====================

  // DOCUMENTS - Tutti tranne GUEST
  {
    path: 'documents',
    component: DocumentsComponent,
    canActivate: [authGuard, permissionGuard],
    data: {
      permissions: [Permission.VIEW_DOCUMENTS],
    },
  },

  // DOCUMENTS per veicolo specifico - Con controllo per DRIVER
  {
    path: 'documents/:vehicleId',
    component: DocumentsComponent,
    canActivate: [authGuard, permissionGuard],
    data: {
      permissions: [Permission.VIEW_DOCUMENTS],
    },
  },

  // ==================== FALLBACK ====================

  // 404 - Pagina non trovata
  { path: '**', redirectTo: '/home' },
];

/**
 * NOTES PER L'IMPLEMENTAZIONE:
 *
 * 1. Le guard `permissionGuard` verificano i permessi specificati in data.permissions
 * 2. La guard `roleGuard` verifica se l'utente ha uno dei ruoli in data.roles
 * 3. Per DRIVER: la logica di filtro per il proprio veicolo va implementata nel componente
 * 4. Usa `anyPermissions` invece di `permissions` se vuoi che l'utente abbia almeno uno dei permessi
 *
 * Esempio con anyPermissions:
 * data: {
 *   anyPermissions: [Permission.VIEW_ALL_VEHICLES_MAP, Permission.VIEW_OWN_VEHICLE_MAP]
 * }
 *
 * In questo caso usa `anyPermissionGuard` invece di `permissionGuard`
 */
