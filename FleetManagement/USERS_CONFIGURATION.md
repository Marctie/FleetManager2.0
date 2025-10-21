# 👥 Configurazione Utenti Fleet Manager

## Utenti Configurati

Il sistema è stato configurato per 4 utenti con ruoli specifici:

---

## 1. 👑 Administrator (admin)

**Username:** `admin`  
**Ruolo:** `ADMINISTRATOR`  
**Email:** `admin@fleetmanagement.com`

### Permessi

✅ **Accesso completo** a tutte le funzionalità del sistema

### Può fare:

- ✅ Gestire veicoli (CRUD completo)
- ✅ Eliminare veicoli
- ✅ Gestire utenti (creazione, modifica, eliminazione)
- ✅ Assegnare veicoli ai driver
- ✅ Gestire documenti (upload, download, eliminazione)
- ✅ Gestire assegnazioni (CRUD completo)
- ✅ Visualizzare telemetria di tutti i veicoli
- ✅ Accedere a report e statistiche
- ✅ Configurare il sistema

### Pagine accessibili:

- Dashboard completa
- Lista veicoli (tutte le operazioni)
- Dettaglio veicolo
- Form creazione/modifica veicolo
- Mappa flotta real-time
- Gestione utenti
- Gestione assegnazioni
- Report e statistiche
- Gestione documenti
- Configurazione sistema

---

## 2. 💼 Fleet Manager (manager)

**Username:** `manager`  
**Ruolo:** `FLEET_MANAGER` (MANAGER dall'API)  
**Email:** `manager@fleetmanagement.com`

### Permessi

✅ Gestione operativa della flotta  
❌ NO eliminazione veicoli  
❌ NO gestione utenti

### Può fare:

- ✅ Visualizzare lista veicoli
- ✅ Creare nuovi veicoli
- ✅ Modificare veicoli esistenti
- ❌ **NON può** eliminare veicoli (solo Administrator)
- ✅ Assegnare veicoli ai driver
- ✅ Cambiare stato veicoli (Disponibile, In Uso, Manutenzione, Fuori Servizio)
- ✅ Upload/download documenti
- ✅ Visualizzare telemetria real-time
- ✅ Gestire assegnazioni (creazione, modifica, completamento)
- ❌ **NON può** gestire utenti (solo Administrator)
- ❌ **NON può** eliminare documenti (solo Administrator)
- ❌ **NON può** eliminare assegnazioni (solo Administrator)

### Pagine accessibili:

- Dashboard flotta
- Lista veicoli (no eliminazione)
- Dettaglio veicolo
- Form creazione/modifica veicolo
- Mappa flotta
- Gestione assegnazioni (no eliminazione)
- Report
- Gestione documenti (no eliminazione)

---

## 3. 🚗 Driver (driver1)

**Username:** `driver1`  
**Ruolo:** `DRIVER`  
**Email:** `driver1@fleetmanagement.com`  
**Veicolo Assegnato:** ⚠️ Da configurare

### Permessi

✅ Accesso **limitato al proprio veicolo** assegnato  
❌ Non può accedere ai dati di altri veicoli

### Può fare:

- ✅ Visualizzare lista veicoli (sola lettura per altri veicoli)
- ✅ Visualizzare dettaglio del **proprio veicolo** assegnato
- ✅ Aggiornare stato del **proprio veicolo**
- ✅ Upload documenti per il **proprio veicolo** (report danni, ricevute)
- ✅ Visualizzare documenti del **proprio veicolo**
- ✅ Visualizzare telemetria del **proprio veicolo**
- ✅ Visualizzare le **proprie** assegnazioni
- ❌ **NON può** modificare dati veicolo (marca, modello, targa)
- ❌ **NON può** assegnare veicoli
- ❌ **NON può** accedere a veicoli non assegnati
- ❌ **NON può** eliminare documenti

### Pagine accessibili:

- Dashboard personale (solo proprio veicolo)
- Lista veicoli (visualizzazione limitata)
- Dettaglio proprio veicolo
- Mappa posizione proprio veicolo
- Le mie assegnazioni
- Upload documenti (solo proprio veicolo)

### ⚠️ Configurazione Necessaria

Per assegnare un veicolo a `driver1`:

1. **Opzione 1: Via API**

   - L'API deve includere `assignedVehicleId` nella risposta login
   - Esempio: `{ "assignedVehicleId": 123 }`

2. **Opzione 2: Via Configurazione**
   - Modifica `src/app/models/user-config.ts`
   - Trova l'oggetto di `driver1` e aggiungi:
   ```typescript
   {
     username: 'driver1',
     role: UserRole.DRIVER,
     displayName: 'Driver 1',
     email: 'driver1@fleetmanagement.com',
     assignedVehicleId: 123, // ⬅️ ID del veicolo
   }
   ```

---

## 4. 👁️ Viewer (viewer)

**Username:** `viewer`  
**Ruolo:** `VIEWER`  
**Email:** `viewer@fleetmanagement.com`

### Permessi

✅ **Solo visualizzazione** (nessuna modifica)

### Può fare:

- ✅ Visualizzare lista veicoli (sola lettura)
- ✅ Visualizzare dettaglio veicoli
- ✅ Visualizzare e scaricare documenti
- ✅ Visualizzare telemetria
- ✅ Visualizzare report
- ✅ Visualizzare mappa flotta
- ❌ **NON può** creare/modificare/eliminare nulla
- ❌ **NON può** caricare documenti
- ❌ **NON può** cambiare stato veicoli

### Pagine accessibili:

- Dashboard (sola lettura)
- Lista veicoli (sola lettura)
- Dettaglio veicolo (sola lettura)
- Mappa flotta
- Report (sola lettura)

---

## 🔧 Configurazione Tecnica

### Mapping Automatico Ruoli

Il sistema riconosce automaticamente i ruoli sia per **username** che per **ruolo API**:

#### Da Username:

```typescript
'admin' → ADMINISTRATOR
'manager' → FLEET_MANAGER
'driver1' → DRIVER
'viewer' → VIEWER
```

#### Da Ruolo API:

```typescript
'ADMINISTRATOR' o 'admin' → ADMINISTRATOR
'MANAGER' o 'FLEET_MANAGER' → FLEET_MANAGER  // ⬅️ Entrambi funzionano!
'DRIVER' o 'driver' → DRIVER
'VIEWER' o 'viewer' → VIEWER
```

### File Configurazione

La configurazione è in: `src/app/models/user-config.ts`

```typescript
export const USER_ROLE_MAPPING: Record<string, UserRole> = {
  admin: UserRole.ADMINISTRATOR,
  manager: UserRole.FLEET_MANAGER,
  driver1: UserRole.DRIVER,
  viewer: UserRole.VIEWER,
};
```

---

## 🧪 Testing

### Test Rapido dei Ruoli

Per testare un utente specifico, modifica localStorage nella console del browser:

```javascript
// Test come Administrator
localStorage.setItem('username', 'admin');
localStorage.setItem('userRole', 'ADMINISTRATOR');

// Test come Fleet Manager
localStorage.setItem('username', 'manager');
localStorage.setItem('userRole', 'MANAGER');

// Test come Driver
localStorage.setItem('username', 'driver1');
localStorage.setItem('userRole', 'DRIVER');
// Per driver, imposta anche il veicolo:
localStorage.setItem('assignedVehicleId', '123');

// Test come Viewer
localStorage.setItem('username', 'viewer');
localStorage.setItem('userRole', 'VIEWER');

// Ricarica la pagina
location.reload();
```

---

## 📊 Matrice Accessi Rapida

| Funzionalità             | admin    | manager  | driver1     | viewer   |
| ------------------------ | -------- | -------- | ----------- | -------- |
| **Visualizzare Veicoli** | ✅ Tutti | ✅ Tutti | ✅ Limitato | ✅ Tutti |
| **Creare Veicoli**       | ✅       | ✅       | ❌          | ❌       |
| **Modificare Veicoli**   | ✅       | ✅       | ❌          | ❌       |
| **Eliminare Veicoli**    | ✅       | ❌       | ❌          | ❌       |
| **Assegnare Veicoli**    | ✅       | ✅       | ❌          | ❌       |
| **Cambiare Stato**       | ✅       | ✅       | ✅ Proprio  | ❌       |
| **Gestire Utenti**       | ✅       | ❌       | ❌          | ❌       |
| **Upload Documenti**     | ✅       | ✅       | ✅ Proprio  | ❌       |
| **Eliminare Documenti**  | ✅       | ❌       | ❌          | ❌       |
| **Gestire Assegnazioni** | ✅       | ✅       | ❌          | ❌       |
| **Visualizzare Report**  | ✅       | ✅       | ✅          | ✅       |
| **Mappa Flotta**         | ✅       | ✅       | ✅ Proprio  | ✅       |
| **Config Sistema**       | ✅       | ❌       | ❌          | ❌       |

---

## 🚀 Prossimi Step

### 1. Configurare Veicolo per driver1 ⚠️

Scegli una delle opzioni:

**Opzione A: Via API (Raccomandato)**

```json
// Risposta API login per driver1 deve includere:
{
  "token": "...",
  "userId": "3",
  "username": "driver1",
  "email": "driver1@fleetmanagement.com",
  "role": "DRIVER",
  "assignedVehicleId": 123 // ⬅️ Aggiungi questo!
}
```

**Opzione B: Via Configurazione Frontend**

1. Apri `src/app/models/user-config.ts`
2. Trova `driver1` in `USERS_CONFIG`
3. Aggiungi `assignedVehicleId: 123`

### 2. Aggiornare Routes con Guards ✅

Usa il file `ROUTES_EXAMPLE_WITH_PERMISSIONS.ts` come riferimento per aggiornare `app.routes.ts`

### 3. Aggiornare Componenti ✅

Integra `PermissionService` nei componenti per controllare i permessi

### 4. Test Completo ✅

Testa il login e la navigazione con tutti e 4 gli utenti

---

## 📞 Supporto

### Verificare Ruolo Corrente

Console browser:

```javascript
// Verifica ruolo corrente
console.log('Username:', localStorage.getItem('username'));
console.log('Ruolo:', localStorage.getItem('userRole'));
console.log('Veicolo assegnato:', localStorage.getItem('assignedVehicleId'));
```

### Debug Permessi

I log delle guard appariranno nella console quando tenti di accedere a una pagina:

```
[PERMISSION GUARD] Access granted for user admin
[PERMISSION GUARD] User viewer (VIEWER) does not have required permissions: [CREATE_VEHICLE]
```

---

## ✅ Sistema Pronto!

Il sistema di ruoli è completamente configurato per i 4 utenti:

- ✅ **admin** - Accesso completo
- ✅ **manager** - Gestione operativa
- ✅ **driver1** - Solo proprio veicolo (da configurare assignedVehicleId)
- ✅ **viewer** - Solo lettura

**Pronto per il test! 🎉**
