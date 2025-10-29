import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { catchError, switchMap, throwError } from 'rxjs';

/**
 * HTTP Interceptor per aggiungere automaticamente il token JWT a tutte le richieste
 * e gestire il refresh del token in caso di errore 401
 */
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);

  // Non aggiungere il token alle richieste di login e refresh
  const skipUrls = ['/api/Auth/login', '/api/Auth/refresh'];
  const shouldSkip = skipUrls.some((url) => req.url.includes(url));

  if (shouldSkip || !authService.isAuthenticated()) {
    return next(req);
  }

  // Clona la richiesta e aggiungi il token
  const token = authService.getToken();
  const clonedRequest = req.clone({
    setHeaders: {
      Authorization: `Bearer ${token}`,
    },
  });

  return next(clonedRequest).pipe(
    catchError((error) => {
      if (error.status === 401 && !req.url.includes('/api/Auth/refresh')) {
        console.warn('Token scaduto, tentativo di refresh...');

        return authService.refreshToken().pipe(
          switchMap(() => {
            // Dopo il refresh, ritenta la richiesta originale con il nuovo token
            const newToken = authService.getToken();
            const retryRequest = req.clone({
              setHeaders: {
                Authorization: `Bearer ${newToken}`,
              },
            });
            return next(retryRequest);
          }),
          catchError((refreshError) => {
            // Se anche il refresh fallisce, logout
            console.error('Refresh token fallito, logout necessario');
            authService.logout().subscribe();
            return throwError(() => refreshError);
          })
        );
      }

      return throwError(() => error);
    })
  );
};
