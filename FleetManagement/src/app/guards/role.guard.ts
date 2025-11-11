import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { RoleService } from '../services/role.service';
import { NotificationService } from '../services/notification.service';

/**
 * Guard to allow access only to Administrators
 */
export const adminGuard: CanActivateFn = () => {
  const roleService = inject(RoleService);
  const router = inject(Router);
  const notificationService = inject(NotificationService);

  if (roleService.isAdministrator()) {
    return true;
  }

  const currentRole = roleService.getCurrentUserRole() || 'Undefined';

  // Immediate visual alert
  alert(
    `ACCESS DENIED\n\n` +
      `This section is reserved only for Administrators.\n\n` +
      `Your current role: ${currentRole}\n\n` +
      `To access this feature, please contact a system administrator.`
  );

  // Persistent notification (optional)
  notificationService.showPermissionDenied('Administrators');

  console.warn('Access denied. Administrator only. Current role:', currentRole);
  router.navigate(['/home']);
  return false;
};

/**
 * Guard to allow access to Administrator and Fleet Manager
 */
export const managerGuard: CanActivateFn = () => {
  const roleService = inject(RoleService);
  const router = inject(Router);
  const notificationService = inject(NotificationService);

  if (roleService.isAdministrator() || roleService.isFleetManager()) {
    return true;
  }

  const currentRole = roleService.getCurrentUserRole() || 'Undefined';

  // Immediate visual alert
  alert(
    `ACCESS DENIED\n\n` +
      `This feature is reserved for:\n` +
      `- Administrators\n` +
      `- Fleet Manager\n\n` +
      `Your current role: ${currentRole}\n\n` +
      `To access this feature, please contact an administrator to request the necessary permissions.`
  );

  // Persistent notification (optional)
  notificationService.showPermissionDenied('Administrators or Fleet Manager');

  console.warn('Access denied. Administrator or Fleet Manager only. Current role:', currentRole);
  router.navigate(['/home']);
  return false;
};
