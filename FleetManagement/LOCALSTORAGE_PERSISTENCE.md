# 💾 LocalStorage Persistence - MQTT Data Integration

## Panoramica

Ho integrato la **persistenza localStorage** dal vecchio metodo di TrackingApp nel servizio MQTT di FleetManager. Ora i dati MQTT sopravvivono al refresh della pagina!

---

## 🔄 Confronto: Prima vs Dopo

### ❌ PRIMA (Solo In-Memory)

```typescript
// Dati persi al refresh
ingestPositionMessage(message: any): void {
  const position = { ... };
  this.positionVeiclesListSignal.set([...positions, position]);
  // ❌ Nessun salvataggio persistente
}
```

**Problemi:**

- ❌ Refresh pagina = perdita dati MQTT
- ❌ Mappa vuota dopo F5
- ❌ Necessario attendere nuovi messaggi MQTT

### ✅ DOPO (Persistenza LocalStorage)

```typescript
// Dati salvati e ripristinati
ingestPositionMessage(message: any): void {
  const position = { ... };

  // 1. Salva in localStorage
  this.savePositionToLocalStorage(position);

  // 2. Aggiorna signal
  this.positionVeiclesListSignal.set([...positions, position]);
}

// Al boot dell'app
constructor() {
  this.loadPositionsFromLocalStorage(); // ✅ Ripristina dati
}
```

**Vantaggi:**

- ✅ Dati persistenti anche dopo refresh
- ✅ Mappa popolata immediatamente
- ✅ Esperienza utente fluida

---

## 🔧 Implementazione Dettagliata

### 1. Salvataggio Posizioni

```typescript
private savePositionToLocalStorage(position: VehiclePosition): void {
  // 1. Salva posizione singola per veicolo specifico
  const vehicleKey = `vehicle_${position.vehicleId}_position`;
  localStorage.setItem(vehicleKey, JSON.stringify(position));

  // 2. Aggiorna lista generale (evita duplicati)
  const listKey = 'mqtt_vehicle_positions';
  let positionsList = JSON.parse(localStorage.getItem(listKey) || '[]');

  // Rimuove posizione vecchia dello stesso veicolo
  positionsList = positionsList.filter(p => p.vehicleId !== position.vehicleId);

  // Aggiungi nuova posizione
  positionsList.push(position);

  localStorage.setItem(listKey, JSON.stringify(positionsList));
}
```

**Chiavi LocalStorage:**

- `mqtt_vehicle_positions` - Lista completa posizioni
- `vehicle_{id}_position` - Posizione singola per veicolo
- `vehicle_{id}_status` - Stato singolo per veicolo

### 2. Caricamento all'Avvio

```typescript
constructor() {
  console.log('🔌 MQTT Service initialized');

  // Carica dati persistenti
  this.loadPositionsFromLocalStorage();
}

loadPositionsFromLocalStorage(): void {
  // 1. Carica posizioni
  const rawList = localStorage.getItem('mqtt_vehicle_positions');
  if (rawList) {
    const positionsList = JSON.parse(rawList);
    this.positionVeiclesListSignal.set(positionsList);
    console.log(`📂 Loaded ${positionsList.length} positions from localStorage`);
  }

  // 2. Carica stati
  this.loadStatusesFromLocalStorage();
}

private loadStatusesFromLocalStorage(): void {
  const statusKeys = Object.keys(localStorage)
    .filter(key => key.startsWith('vehicle_') && key.endsWith('_status'));

  const statusesById = {};
  statusKeys.forEach(key => {
    const vehicleId = parseInt(key.replace('vehicle_', '').replace('_status', ''));
    const rawStatus = localStorage.getItem(key);
    if (rawStatus && !isNaN(vehicleId)) {
      statusesById[vehicleId] = JSON.parse(rawStatus);
    }
  });

  this.statusByIdSignal.set(statusesById);
  console.log(`📂 Loaded ${Object.keys(statusesById).length} statuses`);
}
```

### 3. Gestione Duplicati

```typescript
// Evita posizioni duplicate per lo stesso veicolo
positionsList = positionsList.filter((p) => p.vehicleId !== position.vehicleId);
positionsList.push(position); // Aggiungi ultima posizione
```

**Logica:**

1. Rimuove tutte le posizioni vecchie del veicolo
2. Aggiunge solo l'ultima posizione ricevuta
3. Mantiene localStorage pulito e performante

### 4. Cleanup (Utility)

```typescript
clearLocalStoragePositions(): void {
  // Rimuove lista generale
  localStorage.removeItem('mqtt_vehicle_positions');

  // Rimuove posizioni singole
  Object.keys(localStorage)
    .filter(key => key.startsWith('vehicle_') && key.endsWith('_position'))
    .forEach(key => localStorage.removeItem(key));

  // Reset signal
  this.positionVeiclesListSignal.set([]);
  console.log('🗑️ LocalStorage positions cleared');
}
```

---

## 📊 Struttura Dati LocalStorage

### Posizioni

**Chiave:** `mqtt_vehicle_positions`

```json
[
  {
    "vehicleId": 123,
    "latitude": 41.9028,
    "longitude": 12.4964,
    "speed": 60,
    "heading": 180,
    "timestamp": "2025-10-20T15:30:00Z"
  },
  {
    "vehicleId": 456,
    "latitude": 41.91,
    "longitude": 12.5,
    "speed": 45,
    "heading": 90,
    "timestamp": "2025-10-20T15:31:00Z"
  }
]
```

**Chiave:** `vehicle_123_position`

```json
{
  "vehicleId": 123,
  "latitude": 41.9028,
  "longitude": 12.4964,
  "speed": 60,
  "heading": 180,
  "timestamp": "2025-10-20T15:30:00Z"
}
```

### Stati

**Chiave:** `vehicle_123_status`

```json
{
  "status": "online",
  "timestamp": "2025-10-20T15:30:00Z"
}
```

---

## 🎯 Flusso Completo

### Al Boot dell'Applicazione

```
1. MqttService Constructor
   │
   ├─ loadPositionsFromLocalStorage()
   │  ├─ Carica mqtt_vehicle_positions
   │  ├─ Set positionVeiclesListSignal
   │  └─ loadStatusesFromLocalStorage()
   │     ├─ Cerca vehicle_*_status
   │     └─ Set statusByIdSignal
   │
   └─ Log: "📂 Loaded X positions, Y statuses"

2. GeneralMap.ngOnInit()
   │
   ├─ loadVehicles() → API Database
   │  ├─ Merge con posizioni MQTT (da signal)
   │  └─ Mostra marker sulla mappa ✅
   │
   └─ subscribeAndTrack('vehicles/#')
      └─ Pronto per nuovi messaggi MQTT
```

### Ricezione Messaggio MQTT

```
1. MQTT Message Received
   │
   ├─ Topic: vehicles/123/position
   │
2. ingestPositionMessage()
   │
   ├─ Parse payload
   │
   ├─ savePositionToLocalStorage()
   │  ├─ localStorage.setItem('vehicle_123_position', ...)
   │  ├─ Update mqtt_vehicle_positions (no duplicati)
   │  └─ Log: "💾 Position saved to localStorage"
   │
   ├─ Update positionVeiclesListSignal
   │  ├─ Remove old position
   │  └─ Add new position
   │
   └─ Log: "📍 Position updated for vehicle 123"

3. GeneralMap (reactive)
   │
   ├─ Signal updated → UI update
   ├─ Marker moved on map
   └─ Stats recalculated
```

### Dopo Refresh (F5)

```
1. Page Reload
   │
2. MqttService Constructor
   │
   ├─ loadPositionsFromLocalStorage()
   │  ├─ Read mqtt_vehicle_positions
   │  └─ Restore positionVeiclesListSignal ✅
   │
3. GeneralMap Loads
   │
   ├─ loadVehicles()
   │  ├─ DB data + MQTT data (from localStorage)
   │  └─ Mappa popolata immediatamente! 🎉
   │
   └─ No need to wait for new MQTT messages
```

---

## 🔍 Differenze con TrackingApp

| Aspetto        | **TrackingApp (Vecchio)**          | **FleetManager (Nuovo)**                  |
| -------------- | ---------------------------------- | ----------------------------------------- |
| Storage Chiavi | `lista` (unica chiave)             | `mqtt_vehicle_positions` + chiavi singole |
| Deduplicazione | ✅ Manual filter                   | ✅ Automatic filter                       |
| Caricamento    | Manual call                        | ✅ Automatic in constructor               |
| Signal Update  | Manual `updateMqttServiceSignal()` | ✅ Integrated in ingest                   |
| Stati          | ❌ Non salvati                     | ✅ Salvati in localStorage                |
| Cleanup        | ❌ Non implementato                | ✅ `clearLocalStoragePositions()`         |

---

## 🧪 Testing

### 1. Verifica Salvataggio

```typescript
// In browser console
localStorage.getItem('mqtt_vehicle_positions');
// Output: "[{...}, {...}]"

localStorage.getItem('vehicle_123_position');
// Output: "{vehicleId: 123, latitude: 41.9028, ...}"
```

### 2. Test Refresh

1. Apri `/general-map`
2. Attendi messaggi MQTT (vedi marker sulla mappa)
3. Premi F5 (refresh)
4. ✅ I marker dovrebbero riapparire immediatamente

### 3. Test Cleanup

```typescript
// In browser console
mqttService.clearLocalStoragePositions();
// Output: "🗑️ LocalStorage positions cleared"

// Verifica
localStorage.getItem('mqtt_vehicle_positions');
// Output: null
```

---

## ⚙️ Configurazione e Manutenzione

### Dimensione Massima LocalStorage

- **Default browser limit:** ~5-10 MB
- **Stima per veicolo:** ~200 bytes
- **Capacità stimata:** ~25,000-50,000 posizioni

### Pulizia Automatica (Opzionale)

Puoi implementare una pulizia automatica di posizioni vecchie:

```typescript
private cleanupOldPositions(maxAgeHours: number = 24): void {
  const now = Date.now();
  const maxAge = maxAgeHours * 60 * 60 * 1000;

  const positionsList = this.positionVeiclesListSignal();
  const filteredPositions = positionsList.filter(p => {
    const age = now - new Date(p.timestamp).getTime();
    return age < maxAge;
  });

  this.positionVeiclesListSignal.set(filteredPositions);
  localStorage.setItem('mqtt_vehicle_positions', JSON.stringify(filteredPositions));

  console.log(`🧹 Cleaned ${positionsList.length - filteredPositions.length} old positions`);
}
```

### Migrazione Dati (Se necessario)

```typescript
// Migra da vecchia struttura TrackingApp a nuova
migrateFromTrackingApp(): void {
  const oldList = localStorage.getItem('lista');
  if (oldList) {
    const positions = JSON.parse(oldList);
    localStorage.setItem('mqtt_vehicle_positions', oldList);
    localStorage.removeItem('lista');
    console.log('✅ Migrated from TrackingApp storage structure');
  }
}
```

---

## 📚 Vantaggi Implementazione Attuale

1. **Doppio Storage**

   - Lista generale: accesso veloce
   - Chiavi singole: recupero per veicolo specifico

2. **Auto-Load**

   - Dati caricati automaticamente al boot
   - Nessun codice extra nei componenti

3. **Deduplicazione Automatica**

   - Una sola posizione per veicolo
   - LocalStorage sempre pulito

4. **Gestione Stati**

   - Stati persistenti come le posizioni
   - Coerenza dopo refresh

5. **Utility Methods**
   - `clearLocalStoragePositions()` per debug/reset
   - Espandibile per cleanup automatico

---

## 🎉 Conclusione

La nuova implementazione combina:

- ✅ **Persistenza** di TrackingApp (localStorage)
- ✅ **Reattività** di FleetManager (signals)
- ✅ **Performance** (deduplicazione, auto-load)
- ✅ **Manutenibilità** (cleanup, utilities)

**Risultato:** Esperienza utente ottimale con dati sempre disponibili anche dopo refresh! 🚀
