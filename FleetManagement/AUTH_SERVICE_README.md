# Authentication Service - Documentazione

## 📁 Struttura File Creati

```
src/app/
├── services/
│   └── auth.service.ts          # Service principale per l'autenticazione
├── guards/
│   └── auth.guard.ts            # Guards per proteggere le route
├── interceptors/
│   └── auth.interceptor.ts      # Interceptor per aggiungere token alle richieste
└── login.ts                     # Componente di login (già esistente)
```

## 🔐 AuthService

Il service principale per gestire l'autenticazione basato sulle API Swagger.

### Metodi Disponibili

#### Login

```typescript
login(credentials: LoginRequest): Observable<AuthResponse>
```

Effettua il login dell'utente e salva i dati di autenticazione.

**Esempio:**

```typescript
constructor(private authService: AuthService) {}

onLogin() {
  this.authService.login({
    username: 'admin',
    password: 'password123'
  }).subscribe({
    next: (response) => {
      console.log('Login effettuato!', response);
      // Reindirizza alla dashboard
    },
    error: (error) => {
      console.error('Errore login:', error);
    }
  });
}
```

#### Logout

```typescript
logout(): Observable<any>
```

Effettua il logout, chiama l'API e pulisce i dati locali.

**Esempio:**

```typescript
onLogout() {
  this.authService.logout().subscribe({
    next: () => {
      console.log('Logout effettuato');
      // Reindirizzamento automatico al login
    }
  });
}
```

#### Refresh Token

```typescript
refreshToken(): Observable<AuthResponse>
```

Aggiorna il token usando il refresh token.

**Esempio:**

```typescript
// Chiamato automaticamente dall'interceptor quando il token scade
// Può anche essere chiamato manualmente
this.authService.refreshToken().subscribe();
```

#### Verifica Autenticazione

```typescript
isAuthenticated(): boolean
```

Verifica se l'utente è autenticato.

**Esempio:**

```typescript
if (this.authService.isAuthenticated()) {
  console.log('Utente autenticato');
}
```

#### Ottieni Informazioni Utente

```typescript
getCurrentUser(): UserInfo | null
getUserRole(): string | null
getUserId(): string | null
getToken(): string | null
```

**Esempio:**

```typescript
const user = this.authService.getCurrentUser();
console.log('Utente corrente:', user);

const role = this.authService.getUserRole();
console.log('Ruolo:', role);
```

#### Observable per lo Stato

```typescript
currentUser$: Observable<UserInfo | null>;
isAuthenticated$: Observable<boolean>;
```

**Esempio:**

```typescript
// Nel template
<div *ngIf="authService.isAuthenticated$ | async">
  Benvenuto {{ (authService.currentUser$ | async)?.username }}
</div>

// Nel componente
this.authService.currentUser$.subscribe(user => {
  if (user) {
    console.log('Utente:', user);
  }
});
```

## 🛡️ Guards

### Auth Guard

Protegge le route che richiedono autenticazione.

**Uso in app.routes.ts:**

```typescript
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [authGuard],
  },
];
```

### Guest Guard

Impedisce agli utenti autenticati di accedere a pagine come login.

**Uso:**

```typescript
import { guestGuard } from './guards/auth.guard';

export const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
    canActivate: [guestGuard],
  },
];
```

### Role Guard

Controlla i ruoli degli utenti.

**Uso:**

```typescript
import { roleGuard } from './guards/auth.guard';

export const routes: Routes = [
  {
    path: 'admin',
    component: AdminComponent,
    canActivate: [roleGuard],
    data: { roles: ['admin', 'manager'] },
  },
];
```

## 🔄 HTTP Interceptor

L'interceptor aggiunge automaticamente il token JWT a tutte le richieste HTTP e gestisce il refresh automatico del token.

### Funzionalità:

- ✅ Aggiunge automaticamente `Authorization: Bearer <token>` a tutte le richieste
- ✅ Esclude le richieste di login e refresh
- ✅ Gestisce automaticamente il refresh del token su errore 401
- ✅ Effettua logout automatico se il refresh fallisce

**Configurato automaticamente in `app.config.ts`**

## 📊 Interfaces

### LoginRequest

```typescript
interface LoginRequest {
  username: string;
  password: string;
}
```

### AuthResponse

```typescript
interface AuthResponse {
  token: string;
  refreshToken: string;
  userId: string;
  username: string;
  email: string;
  role: string;
  expiresAt: string;
}
```

### UserInfo

```typescript
interface UserInfo {
  userId: string;
  username: string;
  email: string;
  role: string;
}
```

## 💾 Storage

I dati vengono salvati nel `localStorage`:

- `authToken` - Token JWT
- `refreshToken` - Refresh token
- `userId` - ID utente
- `username` - Username
- `email` - Email
- `userRole` - Ruolo utente
- `expiresAt` - Data di scadenza token

## 🎯 Features

### ✅ Implementate

- Login con username e password
- Logout con chiamata API
- Refresh token automatico
- Salvataggio dati nel localStorage
- Observable per stato autenticazione
- Auth Guard per proteggere route
- Guest Guard per route pubbliche
- Role Guard per controllo ruoli
- HTTP Interceptor per aggiungere token
- Refresh automatico del token su 401
- Controllo scadenza token

### 🔒 Sicurezza

- Token JWT con scadenza
- Refresh token per sessioni lunghe
- Logout automatico su token scaduto
- Pulizia automatica dei dati sensibili
- Protezione route con guards

## 🚀 Esempio Completo

### Componente di Dashboard Protetto

```typescript
import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="dashboard">
      <header>
        <h1>Dashboard</h1>
        <div *ngIf="currentUser$ | async as user">
          <p>Benvenuto, {{ user.username }}!</p>
          <p>Ruolo: {{ user.role }}</p>
          <button (click)="logout()">Logout</button>
        </div>
      </header>
    </div>
  `,
})
export class DashboardComponent implements OnInit {
  authService = inject(AuthService);
  currentUser$ = this.authService.currentUser$;

  ngOnInit() {
    console.log('Dashboard caricata');
    const user = this.authService.getCurrentUser();
    console.log('Utente corrente:', user);
  }

  logout() {
    this.authService.logout().subscribe({
      next: () => console.log('Logout completato'),
      error: (err) => console.error('Errore logout:', err),
    });
  }
}
```

### Route Configuration Completa

```typescript
import { Routes } from '@angular/router';
import { LoginComponent } from './login';
import { DashboardComponent } from './dashboard';
import { AdminComponent } from './admin';
import { authGuard, guestGuard, roleGuard } from './guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/login',
    pathMatch: 'full',
  },
  {
    path: 'login',
    component: LoginComponent,
    canActivate: [guestGuard],
  },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [authGuard],
  },
  {
    path: 'admin',
    component: AdminComponent,
    canActivate: [roleGuard],
    data: { roles: ['admin'] },
  },
];
```

## 📝 Note

- Il service è configurato come `providedIn: 'root'` quindi è un singleton
- Il token viene controllato all'avvio dell'applicazione
- Il refresh automatico viene effettuato quando mancano meno di 5 minuti alla scadenza
- Tutti i dati sensibili vengono puliti al logout o alla scadenza del token

## 🔧 Configurazione

Gli endpoint dell'API sono configurati nel service:

```typescript
private readonly API_BASE_URL = 'http://10.0.90.9/Stage/FleetManagement';
private readonly AUTH_ENDPOINTS = {
  login: `${this.API_BASE_URL}/api/Auth/login`,
  refresh: `${this.API_BASE_URL}/api/Auth/refresh`,
  logout: `${this.API_BASE_URL}/api/Auth/logout`
};
```

Per modificare gli endpoint, aggiorna queste costanti nel file `auth.service.ts`.
