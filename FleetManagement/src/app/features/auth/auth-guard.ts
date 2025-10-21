import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '../../services/auth.service';

/**
 * Guard to protect routes that require authentication
 * If the user is not authenticated, they are redirected to login
 */
export const authGuard: CanActivateFn = (_route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isAuthenticated()) {
    return true;
  }

  // Save the requested URL to redirect after login
  const returnUrl = state.url;
  console.log('Access denied. Redirecting to login...');

  router.navigate(['/login'], {
    queryParams: { returnUrl },
  });

  return false;
};

/**
 * Guard to protect the login page (not accessible if already authenticated)
 */
export const guestGuard: CanActivateFn = (_route, _state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (!authService.isAuthenticated()) {
    return true;
  }

  console.log('Already authenticated. Redirecting to home...');
  router.navigate(['/home']);

  return false;
};
