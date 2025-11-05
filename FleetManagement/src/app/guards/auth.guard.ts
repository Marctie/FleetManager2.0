import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';

/**
 * Auth Guard to protect routes that require authentication
 * Usage: { path: 'dashboard', component: DashboardComponent, canActivate: [authGuard] }
 */
export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isAuthenticated()) {
    return true;
  }

  // Save the URL the user was trying to access
  const returnUrl = state.url;
  console.warn('Access denied. Redirecting to login...');

  // Redirect to login
  router.navigate(['/login'], { queryParams: { returnUrl } });
  return false;
};

/**
 * Guest Guard to prevent authenticated users from accessing certain pages
 * (e.g. login, register)
 * Usage: { path: 'login', component: LoginComponent, canActivate: [guestGuard] }
 */
export const guestGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (!authService.isAuthenticated()) {
    return true;
  }

  // If user is already authenticated, redirect to home or dashboard
  console.log('User already authenticated. Redirecting...');
  router.navigate(['/']);
  return false;
};
