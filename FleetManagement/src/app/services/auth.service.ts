import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject, tap, catchError, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { IAuthResponse } from '../models/IAutentication';
import { ILoginRequest } from '../models/ILogin';
import { IUserInfo } from '../models/IUserInfo';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);

  // Base URL dall'API
  private readonly API_BASE_URL = 'http://10.0.90.9/Stage/FleetManagement';
  private readonly AUTH_ENDPOINTS = {
    login: `${this.API_BASE_URL}/api/Auth/login`,
    refresh: `${this.API_BASE_URL}/api/Auth/refresh`,
    logout: `${this.API_BASE_URL}/api/Auth/logout`,
  };

  private readonly STORAGE_KEYS = {
    token: 'authToken',
    refreshToken: 'refreshToken',
    userId: 'userId',
    username: 'username',
    email: 'email',
    role: 'role',
    expiresAt: 'expiresAt',
  };

  private currentUserSubject = new BehaviorSubject<IUserInfo | null>(this.getUserFromStorage());
  public currentUser$ = this.currentUserSubject.asObservable();

  private isAuthenticatedSubject = new BehaviorSubject<boolean>(this.hasValidToken());
  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  constructor() {
    // Verifica se il token è scaduto all'avvio
    this.checkTokenExpiration();
  }

  /**
   * @returns Observable con la risposta di autenticazione
   */
  login(credentials: ILoginRequest): Observable<IAuthResponse> {
    console.log('Tentativo di login con:', { username: credentials.username });
    console.log('Endpoint:', this.AUTH_ENDPOINTS.login);
    console.log('Payload completo:', JSON.stringify(credentials));

    return this.http.post<IAuthResponse>(this.AUTH_ENDPOINTS.login, credentials).pipe(
      tap((response) => {
        console.log('Risposta ricevuta:', response);
        if (response && response.token) {
          this.saveAuthData(response);
          this.currentUserSubject.next(this.mapToIUserInfo(response));
          this.isAuthenticatedSubject.next(true);
          console.log('Login effettuato con successo');
        }
      }),
      catchError((error) => {
        console.error('Errore HTTP completo:', {
          status: error.status,
          statusText: error.statusText,
          url: error.url,
          error: error.error,
          message: error.message,
          headers: error.headers,
        });
        return throwError(() => error);
      })
    );
  }

  logout(): Observable<any> {
    // Se è un ospite, fai solo logout locale
    if (this.isGuestMode()) {
      this.clearAuthData();
      this.currentUserSubject.next(null);
      this.isAuthenticatedSubject.next(false);
      this.router.navigate(['/login']);
      console.log('Logout ospite effettuato');
      return new Observable((observer) => {
        observer.next({});
        observer.complete();
      });
    }

    // Altrimenti procedi con logout API normale
    const token = this.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.http.post(this.AUTH_ENDPOINTS.logout, {}, { headers }).pipe(
      tap(() => {
        this.clearAuthData();
        this.currentUserSubject.next(null);
        this.isAuthenticatedSubject.next(false);
        this.router.navigate(['/login']);
        console.log('Logout effettuato con successo');
      }),
      catchError((error) => {
        this.clearAuthData();
        this.currentUserSubject.next(null);
        this.isAuthenticatedSubject.next(false);
        this.router.navigate(['/login']);
        console.error('Errore durante il logout:', error);
        return throwError(() => error);
      })
    );
  }

  /**
   * @returns Observable con la nuova risposta di autenticazione + aggiornamento token
   */
  refreshToken(): Observable<IAuthResponse> {
    const refreshToken = this.getRefreshToken();

    if (!refreshToken) {
      return throwError(() => new Error('Refresh token non disponibile'));
    }

    return this.http.post<IAuthResponse>(this.AUTH_ENDPOINTS.refresh, refreshToken).pipe(
      tap((response) => {
        if (response && response.token) {
          this.saveAuthData(response);
          this.currentUserSubject.next(this.mapToIUserInfo(response));
          console.log('Token aggiornato con successo');
        }
      }),
      catchError((error) => {
        console.error('Errore durante il refresh del token:', error);
        this.clearAuthData();
        this.currentUserSubject.next(null);
        this.isAuthenticatedSubject.next(false);
        this.router.navigate(['/login']);
        return throwError(() => error);
      })
    );
  }

  isAuthenticated(): boolean {
    return this.hasValidToken() || this.isGuestMode();
  }

  /**
   * ACCESSO GUEST X MARCO AL CLICK DELL IMMAGINE ALLA LOGIN
   */
  loginAsGuest(): void {
    const guestUser: IUserInfo = {
      userId: 'guest',
      username: 'Guest User',
      email: 'guest@fleetmanagement.com',
    };

    localStorage.setItem(this.STORAGE_KEYS.userId, 'guest');
    localStorage.setItem(this.STORAGE_KEYS.username, 'Guest User');
    localStorage.setItem(this.STORAGE_KEYS.email, 'guest@fleetmanagement.com');

    this.currentUserSubject.next(guestUser);
    this.isAuthenticatedSubject.next(true);

    console.log('Accesso come ospite effettuato');
  }

  /**
   * @returns true se l'utente è un ospite
   */
  isGuestMode(): boolean {
    return localStorage.getItem(this.STORAGE_KEYS.userId) === 'guest';
  }

  getToken(): string | null {
    return localStorage.getItem(this.STORAGE_KEYS.token);
  }

  /**
   * @returns Il refresh token o null se non esiste
   */
  getRefreshToken(): string | null {
    return localStorage.getItem(this.STORAGE_KEYS.refreshToken);
  }

  /**
   * @returns Le informazioni dell'utente o null se non autenticato
   */
  getCurrentUser(): IUserInfo | null {
    return this.currentUserSubject.value;
  }

  /**
   * @returns UserInfo con ruolo
   */
  getCurrentUserInfo(): {
    id: number;
    username: string;
    email?: string;
    assignedVehicleId?: number;
  } | null {
    const user = this.getCurrentUser();
    if (!user) return null;

    return {
      id: parseInt(user.userId) || 0,
      username: user.username,
      email: user.email,
    };
  }

  /**
   * Ottiene l'ID dell'utente corrente
   * @returns L'ID dell'utente o null
   */
  getUserId(): string | null {
    return localStorage.getItem(this.STORAGE_KEYS.userId);
  }

  /**
   * Verifica se il token è scaduto
   */
  isTokenExpired(): boolean {
    const expiresAt = localStorage.getItem(this.STORAGE_KEYS.expiresAt);
    if (!expiresAt) return true;

    const expirationDate = new Date(expiresAt);
    return expirationDate <= new Date();
  }

  getAuthHeaders(): HttpHeaders {
    const token = this.getToken();
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  /**
   * Salva i dati di autenticazione nel localStorage
   */
  private saveAuthData(response: IAuthResponse): void {
    localStorage.setItem(this.STORAGE_KEYS.token, response.token);
    localStorage.setItem(this.STORAGE_KEYS.refreshToken, response.refreshToken);
    localStorage.setItem(this.STORAGE_KEYS.userId, response.userId);
    localStorage.setItem(this.STORAGE_KEYS.username, response.username);
    localStorage.setItem(this.STORAGE_KEYS.email, response.email);
    localStorage.setItem(this.STORAGE_KEYS.role, response.role);
    localStorage.setItem(this.STORAGE_KEYS.expiresAt, response.expiresAt);
  }

  /**
   * Pulisce tutti i dati di autenticazione dal localStorage
   */
  private clearAuthData(): void {
    Object.values(this.STORAGE_KEYS).forEach((key) => {
      localStorage.removeItem(key);
    });
  }

  private hasValidToken(): boolean {
    const token = this.getToken();
    return token !== null && !this.isTokenExpired();
  }

  private getUserFromStorage(): IUserInfo | null {
    const userId = localStorage.getItem(this.STORAGE_KEYS.userId);
    const username = localStorage.getItem(this.STORAGE_KEYS.username);
    const email = localStorage.getItem(this.STORAGE_KEYS.email);
    const role = localStorage.getItem(this.STORAGE_KEYS.role);

    if (userId && username && email) {
      return { userId, username, email, role: role || undefined };
    }
    return null;
  }

  private mapToIUserInfo(response: IAuthResponse): IUserInfo {
    return {
      userId: response.userId,
      username: response.username,
      email: response.email,
      role: response.role,
    };
  }

  /**
   * Controlla la scadenza del token e effettua il refresh se necessario
   */
  private checkTokenExpiration(): void {
    if (this.hasValidToken()) {
      const expiresAt = localStorage.getItem(this.STORAGE_KEYS.expiresAt);
      if (expiresAt) {
        const expirationDate = new Date(expiresAt);
        const now = new Date();
        const timeUntilExpiration = expirationDate.getTime() - now.getTime();

        // Se mancano meno di 5 minuti alla scadenza, effettua il refresh
        if (timeUntilExpiration < 5 * 60 * 1000 && timeUntilExpiration > 0) {
          console.log('Token in scadenza, refresh automatico...');
          this.refreshToken().subscribe();
        }
      }
    } else if (this.getToken()) {
      this.clearAuthData();
      this.currentUserSubject.next(null);
      this.isAuthenticatedSubject.next(false);
    }
  }
}
