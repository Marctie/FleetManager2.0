# 📋 Sistema di Ruoli e Permessi - Riepilogo Implementazione

## ✅ File Creati

### 1. Core System Files

- ✅ **`src/app/models/user-roles.ts`** - Definizione ruoli, permessi e configurazioni
- ✅ **`src/app/services/permission.service.ts`** - Service per verificare i permessi
- ✅ **`src/app/guards/permission.guard.ts`** - Guards per proteggere le rotte
- ✅ **`src/app/directives/permission.directive.ts`** - Direttive per template HTML

### 2. Updates to Existing Files

- ✅ **`src/app/services/auth.service.ts`**
  - Aggiunto `getCurrentUserInfo()` per mapping ruoli
  - Integrazione con nuovo sistema UserRole

### 3. Documentation

- ✅ **`ROLES_GUIDE.md`** - Guida completa all'uso del sistema
- ✅ **`ROUTES_EXAMPLE_WITH_PERMISSIONS.ts`** - Esempio routes con permessi

---

## 🎯 Ruoli Implementati

| Ruolo            | Codice          | Descrizione                         |
| ---------------- | --------------- | ----------------------------------- |
| 👑 Administrator | `ADMINISTRATOR` | Accesso completo                    |
| 💼 Fleet Manager | `FLEET_MANAGER` | Gestione operativa flotta           |
| 🚗 Driver        | `DRIVER`        | Accesso limitato al proprio veicolo |
| 👁️ Viewer        | `VIEWER`        | Solo visualizzazione                |
| 🔓 Guest         | `GUEST`         | Accesso temporaneo limitato         |

---

## 📦 Permessi Implementati (24 totali)

### Veicoli (6)

- `VIEW_VEHICLES`
- `CREATE_VEHICLE`
- `EDIT_VEHICLE`
- `DELETE_VEHICLE`
- `ASSIGN_VEHICLE`
- `CHANGE_VEHICLE_STATUS`

### Utenti (4)

- `VIEW_USERS`
- `CREATE_USER`
- `EDIT_USER`
- `DELETE_USER`

### Documenti (4)

- `VIEW_DOCUMENTS`
- `UPLOAD_DOCUMENTS`
- `DELETE_DOCUMENTS`
- `DOWNLOAD_DOCUMENTS`

### Assegnazioni (5)

- `VIEW_ASSIGNMENTS`
- `CREATE_ASSIGNMENT`
- `EDIT_ASSIGNMENT`
- `DELETE_ASSIGNMENT`
- `COMPLETE_ASSIGNMENT`

### Telemetria e Mappe (3)

- `VIEW_TELEMETRY`
- `VIEW_ALL_VEHICLES_MAP`
- `VIEW_OWN_VEHICLE_MAP`

### Report e Dashboard (3)

- `VIEW_REPORTS`
- `VIEW_DASHBOARD`
- `VIEW_STATISTICS`

### Sistema (1)

- `MANAGE_SYSTEM_CONFIG`

---

## 🚀 Come Usare

### 1. Proteggere una Rotta

```typescript
// In app.routes.ts
{
  path: 'vehicles/create',
  component: VehicleFormComponent,
  canActivate: [authGuard, permissionGuard],
  data: {
    permissions: [Permission.CREATE_VEHICLE]
  }
}
```

### 2. Verificare Permessi nel Component

```typescript
import { PermissionService } from './services/permission.service';
import { AuthService } from './services/auth.service';
import { Permission } from './models/user-roles';

export class MyComponent {
  private authService = inject(AuthService);
  private permissionService = inject(PermissionService);

  canEdit = false;

  ngOnInit() {
    const user = this.authService.getCurrentUserInfo();
    if (user) {
      this.canEdit = this.permissionService.hasPermission(user.role, Permission.EDIT_VEHICLE);
    }
  }
}
```

### 3. Usare Direttive nel Template

```html
<!-- Import della direttiva nel component -->
import { HasPermissionDirective } from './directives/permission.directive'; @Component({ imports:
[HasPermissionDirective, ...], ... })

<!-- Uso nel template -->
<button *hasPermission="'CREATE_VEHICLE'" (click)="create()">Create Vehicle</button>

<div *hasRole="'ADMINISTRATOR'">Admin Panel</div>
```

---

## 🔧 Prossimi Step per l'Implementazione

### Step 1: Aggiornare le Routes ⏳

```typescript
// Copia il contenuto da ROUTES_EXAMPLE_WITH_PERMISSIONS.ts
// in app.routes.ts
```

### Step 2: Aggiornare i Componenti ⏳

```typescript
// Per ogni componente che gestisce veicoli:
// 1. Inietta PermissionService e AuthService
// 2. Verifica i permessi in ngOnInit
// 3. Implementa logica per DRIVER (solo proprio veicolo)
```

### Step 3: Aggiornare i Template HTML ⏳

```html
<!-- Usa le direttive per nascondere/mostrare elementi -->
<button *hasPermission="'DELETE_VEHICLE'" (click)="delete()">Delete</button>
```

### Step 4: Configurare gli Username ⏳

```typescript
// Quando l'API risponde con i dati utente, assicurati che:
// 1. Il campo 'role' contenga uno dei valori: ADMINISTRATOR, FLEET_MANAGER, DRIVER, VIEWER
// 2. Per i DRIVER, includi anche 'assignedVehicleId'

// Esempio risposta API login:
{
  "token": "...",
  "userId": "123",
  "username": "john.doe",
  "email": "john@example.com",
  "role": "DRIVER",        // ⬅️ Importante!
  "assignedVehicleId": 456  // ⬅️ Solo per DRIVER
}
```

### Step 5: Test dei Ruoli ⏳

```javascript
// Per testare, modifica localStorage nella console browser:
localStorage.setItem('userRole', 'ADMINISTRATOR');
// Poi ricarica la pagina
```

---

## 📋 Checklist Implementazione

### Backend (API) 📌

- [ ] Assicurarsi che l'API login ritorni il campo `role`
- [ ] Valori possibili: `ADMINISTRATOR`, `FLEET_MANAGER`, `DRIVER`, `VIEWER`, `GUEST`
- [ ] Per DRIVER: includere `assignedVehicleId` nella risposta
- [ ] Implementare validazione permessi anche lato server

### Frontend (Angular) 📌

- [x] Creare modelli ruoli e permessi (`user-roles.ts`)
- [x] Creare `PermissionService`
- [x] Creare guards (`permission.guard.ts`)
- [x] Creare direttive (`permission.directive.ts`)
- [x] Aggiornare `AuthService` con `getCurrentUserInfo()`
- [ ] Aggiornare `app.routes.ts` con guards e permessi
- [ ] Aggiornare componenti per usare `PermissionService`
- [ ] Aggiungere direttive nei template HTML
- [ ] Implementare filtri per DRIVER (solo proprio veicolo)
- [ ] Testare ogni ruolo individualmente

### Testing 📌

- [ ] Test ADMINISTRATOR: accesso completo
- [ ] Test FLEET_MANAGER: no eliminazione veicoli, no gestione utenti
- [ ] Test DRIVER: solo proprio veicolo
- [ ] Test VIEWER: solo lettura
- [ ] Test GUEST: accesso molto limitato
- [ ] Test navigazione tra pagine
- [ ] Test errori di permessi negati

---

## 🎓 Risorse

- **Guida Completa**: Leggi `ROLES_GUIDE.md` per esempi dettagliati
- **Esempio Routes**: Vedi `ROUTES_EXAMPLE_WITH_PERMISSIONS.ts`
- **Permission Service**: `src/app/services/permission.service.ts`
- **Direttive**: `src/app/directives/permission.directive.ts`

---

## 💡 Tips

1. **Testing Veloce**: Usa localStorage per simulare diversi ruoli
2. **Log Utili**: I guard loggano i controlli permessi nella console
3. **Messaggi Chiari**: Usa `getPermissionDeniedMessage()` per feedback utente
4. **Componenti Riutilizzabili**: Crea componenti che si adattano al ruolo

---

## ⚠️ Importante

### Sicurezza

- ⚠️ **Mai fidarsi solo del frontend**: Valida sempre i permessi sul server
- ⚠️ **Token JWT**: Assicurati che contenga il ruolo dell'utente
- ⚠️ **API Protection**: Ogni endpoint API deve validare il ruolo

### Performance

- ✅ **Signals**: Il sistema usa Angular Signals per reattività
- ✅ **Lazy Loading**: I permessi sono verificati solo quando necessario
- ✅ **Caching**: `PermissionService` è singleton (providedIn: 'root')

---

## 📞 Supporto

In caso di dubbi:

1. Leggi `ROLES_GUIDE.md` per esempi dettagliati
2. Controlla i console.log delle guards
3. Verifica localStorage: `localStorage.getItem('userRole')`

---

**Sistema pronto all'uso! 🎉**

Prossimo step: Inviami gli username degli utenti per configurare i ruoli specifici.
