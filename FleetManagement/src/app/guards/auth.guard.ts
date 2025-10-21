import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';

/**
 * Auth Guard per proteggere le route che richiedono autenticazione
 * Uso: { path: 'dashboard', component: DashboardComponent, canActivate: [authGuard] }
 */
export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isAuthenticated()) {
    return true;
  }

  // Salva l'URL a cui l'utente stava cercando di accedere
  const returnUrl = state.url;
  console.warn('🔒 Accesso negato. Reindirizzamento al login...');

  // Reindirizza al login
  router.navigate(['/login'], { queryParams: { returnUrl } });
  return false;
};

/**
 * Guest Guard per impedire agli utenti autenticati di accedere a determinate pagine
 * (es. login, register)
 * Uso: { path: 'login', component: LoginComponent, canActivate: [guestGuard] }
 */
export const guestGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (!authService.isAuthenticated()) {
    return true;
  }

  // Se l'utente è già autenticato, reindirizza alla home o dashboard
  console.log('Utente già autenticato. Reindirizzamento...');
  router.navigate(['/']);
  return false;
};
