import { inject } from '@angular/core';
import { Router, CanActivateFn, ActivatedRouteSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { PermissionService } from '../services/permission.service';
import { Permission } from '../models/user-roles';

/**
 * Guard per verificare i permessi dell'utente
 * Uso: canActivate: [permissionGuard], data: { permissions: [Permission.CREATE_VEHICLE] }
 */
export const permissionGuard: CanActivateFn = (route: ActivatedRouteSnapshot) => {
  const authService = inject(AuthService);
  const permissionService = inject(PermissionService);
  const router = inject(Router);

  // Ottieni l'utente corrente
  const currentUser = authService.getCurrentUserInfo();

  if (!currentUser) {
    console.warn('[PERMISSION GUARD] No user found, redirecting to login');
    router.navigate(['/login']);
    return false;
  }

  // Ottieni i permessi richiesti dalla configurazione della rotta
  const requiredPermissions = route.data['permissions'] as Permission[];

  if (!requiredPermissions || requiredPermissions.length === 0) {
    // Nessun permesso specifico richiesto, consenti l'accesso
    return true;
  }

  // Verifica se l'utente ha TUTTI i permessi richiesti
  const hasAllPermissions = permissionService.hasAllPermissions(
    currentUser.role,
    requiredPermissions
  );

  if (!hasAllPermissions) {
    console.warn(
      `[PERMISSION GUARD] User ${currentUser.username} (${currentUser.role}) does not have required permissions:`,
      requiredPermissions
    );

    // Mostra messaggio di errore
    const missingPermission = requiredPermissions.find(
      (p) => !permissionService.hasPermission(currentUser.role, p)
    );

    if (missingPermission) {
      const errorMessage = permissionService.getPermissionDeniedMessage(missingPermission);
      alert(errorMessage);
    }

    // Reindirizza alla home
    router.navigate(['/home']);
    return false;
  }

  console.log(`[PERMISSION GUARD] Access granted for user ${currentUser.username}`);
  return true;
};

/**
 * Guard per verificare se l'utente ha ALMENO UNO dei permessi specificati
 * Uso: canActivate: [anyPermissionGuard], data: { anyPermissions: [Permission.VIEW_VEHICLES, Permission.VIEW_DASHBOARD] }
 */
export const anyPermissionGuard: CanActivateFn = (route: ActivatedRouteSnapshot) => {
  const authService = inject(AuthService);
  const permissionService = inject(PermissionService);
  const router = inject(Router);

  const currentUser = authService.getCurrentUserInfo();

  if (!currentUser) {
    console.warn('[ANY PERMISSION GUARD] No user found, redirecting to login');
    router.navigate(['/login']);
    return false;
  }

  const requiredPermissions = route.data['anyPermissions'] as Permission[];

  if (!requiredPermissions || requiredPermissions.length === 0) {
    return true;
  }

  // Verifica se l'utente ha ALMENO UNO dei permessi richiesti
  const hasAnyPermission = permissionService.hasAnyPermission(
    currentUser.role,
    requiredPermissions
  );

  if (!hasAnyPermission) {
    console.warn(
      `[ANY PERMISSION GUARD] User ${currentUser.username} does not have any of the required permissions`
    );
    alert('You do not have permission to access this page');
    router.navigate(['/home']);
    return false;
  }

  return true;
};

/**
 * Guard per verificare se l'utente ha un ruolo specifico
 * Uso: canActivate: [roleGuard], data: { roles: [UserRole.ADMINISTRATOR, UserRole.FLEET_MANAGER] }
 */
export const roleGuard: CanActivateFn = (route: ActivatedRouteSnapshot) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const currentUser = authService.getCurrentUserInfo();

  if (!currentUser) {
    console.warn('[ROLE GUARD] No user found, redirecting to login');
    router.navigate(['/login']);
    return false;
  }

  const allowedRoles = route.data['roles'] as string[];

  if (!allowedRoles || allowedRoles.length === 0) {
    return true;
  }

  const hasRole = allowedRoles.includes(currentUser.role);

  if (!hasRole) {
    console.warn(
      `[ROLE GUARD] User ${currentUser.username} with role ${currentUser.role} is not allowed. Required roles:`,
      allowedRoles
    );
    alert(`Access denied. Required role: ${allowedRoles.join(' or ')}`);
    router.navigate(['/home']);
    return false;
  }

  console.log(`[ROLE GUARD] Access granted for user ${currentUser.username}`);
  return true;
};
