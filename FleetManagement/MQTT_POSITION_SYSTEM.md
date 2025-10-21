# 📍 Sistema di Posizionamento Veicoli - MQTT Integration

## Panoramica

Il sistema di posizionamento dei veicoli in FleetManager utilizza una **strategia ibrida** che combina:

- **Database** per i dati storici e persistenti
- **MQTT** per aggiornamenti in tempo reale

Questa documentazione spiega come funziona il sistema e come viene implementato.

---

## 🔄 Flusso di Dati

### 1. Inizializzazione Componente

```typescript
ngOnInit(): void {
  // Carica veicoli dal database
  this.loadVehicles();

  // Avvia aggiornamento automatico ogni 30 secondi
  this.startAutoUpdate();

  // 🔥 SUBSCRIBE AL TOPIC UNICO vehicles/# (cattura TUTTI i messaggi)
  this.mqttService.subscribeAndTrack('vehicles/#', (msg) => {
    try {
      const payload = JSON.parse(msg.payload.toString());
      const topic = msg.topic;

      console.log(`📨 MQTT message on topic '${topic}':`, payload);

      // Determina il tipo di messaggio dal topic
      if (topic.includes('/status')) {
        // Messaggio di stato
        console.log('  └─ Type: STATUS');
        this.mqttService.ingestStatusMessage(msg);
      } else if (topic.includes('/position')) {
        // Messaggio di posizione
        console.log('  └─ Type: POSITION');
        this.mqttService.ingestPositionMessage(msg);
      }
    } catch (error) {
      console.error('❌ Error processing MQTT message:', error);
    }
  });
}
```

**Topic MQTT utilizzato:**

- `vehicles/#` - Cattura **tutti** i messaggi dei veicoli con un singolo subscribe
  - Include: `vehicles/123/status`, `vehicles/123/position`, `vehicles/456/status`, etc.
  - Il simbolo `#` è un wildcard MQTT che cattura tutti i livelli di topic sotto `vehicles/`
  - Più efficiente rispetto a multiple subscriptions

---

## 📦 Caricamento Veicoli dal Database

### Metodo `loadVehicles()`

```typescript
private loadVehicles(preserveMapView: boolean = false): void {
  // 1. Ottieni veicoli dal database
  this.vehicleService.getListVehicles(1, 1000).subscribe((response) => {
    console.log(`📦 Loaded ${response.items.length} vehicles from database`);

    // 2. 🔥 RECUPERA I DATI MQTT DAL SERVIZIO
    const mqttPositions = this.mqttService.positionVeiclesList();
    const statusesById = this.mqttService.statusById();

    // 3. 🔥 MERGE: Combina dati DB + dati MQTT
    const updatedVehicles = response.items.map((v) => {
      let next = { ...v };

      // Controlla se esiste una posizione MQTT più recente
      const p = mqttPositions.find((mp) => mp.vehicleId === v.id);
      if (p) {
        const tPos = new Date(p.timestamp).getTime();
        const tDb = new Date(v.lastPosition?.timestamp ?? 0).getTime();

        if (tPos > tDb) {
          next.lastPosition = p; // Usa posizione MQTT
        }
      }

      // Aggiorna lo stato con i dati MQTT
      const s = statusesById[v.id]?.status;
      if (s) {
        next.status = this.normalizeStatus(s);
      }

      return next;
    });

    // 4. Aggiorna il signal con i dati combinati
    this.vehicleList.set(updatedVehicles);

    // 5. Ridisegna i marker sulla mappa
    if (this.map) {
      this.addVehicleMarkers(preserveMapView);
    }
  });
}
```

### Logica di Merge

La funzione confronta i timestamp e utilizza **sempre il dato più recente**:

```typescript
const tPos = new Date(p.timestamp).getTime(); // Timestamp MQTT
const tDb = new Date(v.lastPosition?.timestamp ?? 0).getTime(); // Timestamp DB

if (tPos > tDb) {
  next.lastPosition = p; // MQTT è più recente
}
```

---

## ⏱️ Auto-Update System

### Metodo `startAutoUpdate()`

```typescript
private startAutoUpdate(): void {
  this.stopAutoUpdate();

  const updateInterval = 30000; // 30 secondi
  console.log(`[GENERAL-MAP] Auto-update every ${updateInterval}ms`);

  this.autoUpdateInterval = setInterval(() => {
    console.log('[GENERAL-MAP] Auto-updating vehicle positions');
    this.loadVehicles(true); // preserveMapView = true
  }, updateInterval);
}
```

**Caratteristiche:**

- Esegue `loadVehicles()` ogni 30 secondi
- `preserveMapView = true` evita che la mappa si sposti durante l'aggiornamento
- Si ferma automaticamente quando il componente viene distrutto

---

## 🔄 Refresh Manuale con MQTT

### Metodo `refreshAllVehiclesWithMqtt()`

Questo metodo viene chiamato quando l'utente clicca il pulsante **"Update Positions"**.

```typescript
public refreshAllVehiclesWithMqtt(): void {
  // Recupera gli stati MQTT
  const statusesById = this.mqttService.statusById();
  let updatedCount = 0;

  // Aggiorna ogni veicolo con dati MQTT
  const updated = this.vehicleList().map((v) => {
    const mqttPos = this.getMqttPositionFromService(v.id);
    const s = statusesById[v.id]?.status;

    if (mqttPos || s) {
      updatedCount++;
    }

    return {
      ...v,
      status: s ? this.normalizeStatus(s) : v.status,
      lastPosition: mqttPos
        ? {
            vehicleId: mqttPos.vehicleId,
            latitude: mqttPos.latitude,
            longitude: mqttPos.longitude,
            speed: mqttPos.speed ?? 0,
            heading: mqttPos.heading ?? 0,
            timestamp: mqttPos.timestamp ?? Date.now(),
          }
        : v.lastPosition,
    };
  });

  this.vehicleList.set(updated);
  this.addVehicleMarkers(true);

  const message = updatedCount > 0
    ? `Updated ${updatedCount} vehicles`
    : 'Update successful';
  this.showToastNotification(message, 'success');
}
```

**Differenza con `loadVehicles()`:**

- Non ricarica dal database
- Usa **solo** i dati MQTT già in memoria
- Più veloce per aggiornamenti rapidi
- Mostra notifica toast con il numero di veicoli aggiornati

---

## 🎯 Helper Method: getMqttPositionFromService

```typescript
private getMqttPositionFromService(vehicleId: number): VehiclePosition | null {
  try {
    const mqttPositions = this.mqttService.positionVeiclesList();
    const position = mqttPositions.find((pos) => pos.vehicleId === vehicleId);

    if (position) {
      console.log(`📍 Position found in MQTT service for vehicle ID ${vehicleId}`);
      return position;
    }

    return null;
  } catch (error) {
    console.error('❌ Error retrieving MQTT position:', error);
    return null;
  }
}
```

---

## 📊 MQTT Service - Data Storage

Il servizio MQTT mantiene i dati in memoria usando Angular Signals:

```typescript
// In mqtt.service.ts
private positionVeiclesListSignal = signal<VehiclePosition[]>([]);
private statusByIdSignal = signal<Record<number, { status: string; timestamp: string | number }>>({});

// Accessori pubblici (computed signals)
positionVeiclesList = computed(() => this.positionVeiclesListSignal());
statusById = computed(() => this.statusByIdSignal());
```

### Ingest Methods

**Posizioni:**

```typescript
ingestPositionMessage(message: any): void {
  const payload = JSON.parse(message.payload.toString());
  const vehicleId = payload.vehicleId || this.extractVehicleIdFromTopic(message.topic);

  if (vehicleId && payload.latitude && payload.longitude) {
    const position: VehiclePosition = {
      vehicleId,
      latitude: payload.latitude,
      longitude: payload.longitude,
      speed: payload.speed || 0,
      heading: payload.heading || 0,
      timestamp: payload.timestamp || Date.now(),
    };

    // Aggiorna o aggiunge la posizione
    const currentPositions = this.positionVeiclesListSignal();
    const existingIndex = currentPositions.findIndex((p) => p.vehicleId === vehicleId);

    if (existingIndex >= 0) {
      const updatedPositions = [...currentPositions];
      updatedPositions[existingIndex] = position;
      this.positionVeiclesListSignal.set(updatedPositions);
    } else {
      this.positionVeiclesListSignal.set([...currentPositions, position]);
    }
  }
}
```

**Stati:**

```typescript
ingestStatusMessage(message: any): void {
  const payload = JSON.parse(message.payload.toString());
  const vehicleId = payload.vehicleId || this.extractVehicleIdFromTopic(message.topic);

  if (vehicleId) {
    const currentStatuses = this.statusByIdSignal();
    this.statusByIdSignal.set({
      ...currentStatuses,
      [vehicleId]: {
        status: payload.status || 'unknown',
        timestamp: payload.timestamp || Date.now(),
      },
    });
  }
}
```

---

## 🗺️ Rendering sulla Mappa

### Marker Colorati per Stato

```typescript
private statusColorMap: { [key: string]: string } = {
  active: '#48bb78',    // Verde
  online: '#48bb78',    // Verde
  inactive: '#f56565',  // Rosso
  offline: '#f56565',   // Rosso
  maintenance: '#ecc94b', // Giallo
  default: '#718096',   // Grigio
};
```

### Creazione Marker

```typescript
private addVehicleMarker(vehicle: Vehicle): void {
  const position = vehicle.lastPosition!;
  const markerColor = this.getStatusColor(vehicle.status);

  const customIcon = L.divIcon({
    html: `
      <div style="
        background-color: ${markerColor};
        width: 20px;
        height: 20px;
        border-radius: 50%;
        border: 3px solid white;
        box-shadow: 0 2px 6px rgba(0,0,0,0.3);
      "></div>
    `,
    iconSize: [26, 26],
    iconAnchor: [13, 13],
    popupAnchor: [0, -13],
  });

  const marker = L.marker([position.latitude, position.longitude], {
    icon: customIcon,
  }).addTo(this.map);

  // Popup con dettagli veicolo
  marker.bindPopup(popupContent, {
    closeButton: true,
    autoClose: false,
    closeOnClick: false,
  });

  this.markers.push(marker);
}
```

---

## 📈 Statistiche Veicoli

### Contatori Dinamici

```typescript
// Totale veicoli con posizione valida
getVehiclesWithPosition(): number {
  return this.vehicleList().filter(
    (vehicle) =>
      vehicle.lastPosition &&
      vehicle.lastPosition.latitude &&
      vehicle.lastPosition.longitude
  ).length;
}

// Veicoli online/attivi
getVehiclesOnline(): number {
  return this.vehicleList().filter(
    (v) => this.normalizeStatus(v.status) === 'active'
  ).length;
}

// Veicoli offline/inattivi
getVehiclesOffline(): number {
  return this.vehicleList().filter(
    (v) => this.normalizeStatus(v.status) === 'inactive'
  ).length;
}

// Veicoli in manutenzione
getVehiclesMaintenance(): number {
  return this.vehicleList().filter((vehicle) => {
    const status = vehicle.status?.toLowerCase().trim() || '';
    return status === 'maintenance';
  }).length;
}
```

---

## 🔧 Configurazione MQTT

### Topic Structure

```
vehicles/                    # Root topic
  ├── #                      # Wildcard che cattura TUTTO
  ├── {vehicleId}/status     # Esempio: vehicles/123/status
  ├── {vehicleId}/position   # Esempio: vehicles/123/position
  └── {vehicleId}/...        # Qualsiasi altro subtopic

Subscribe usato: vehicles/#
  - Cattura automaticamente tutti i messaggi sotto vehicles/
  - Include status, position e qualsiasi altro tipo di messaggio
```

**Vantaggi del topic unico `vehicles/#`:**

- ✅ Una sola subscription invece di multiple
- ✅ Cattura automaticamente nuovi tipi di messaggi futuri
- ✅ Più efficiente per il broker MQTT
- ✅ Codice più semplice e manutenibile

### Formato Messaggi

**Status Message** (`vehicles/123/status`):

```json
{
  "vehicleId": 123,
  "status": "online",
  "timestamp": "2025-10-20T15:30:00Z"
}
```

**Position Message** (`vehicles/123/position`):

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

---

## 🎯 Best Practices

### 1. Gestione Timestamp

Usa sempre timestamp confrontabili (milliseconds):

```typescript
const tPos = new Date(p.timestamp).getTime();
const tDb = new Date(v.lastPosition?.timestamp ?? 0).getTime();
```

### 2. Preserva Vista Mappa

Durante aggiornamenti automatici, evita di spostare la mappa:

```typescript
this.loadVehicles(true); // preserveMapView = true
```

### 3. Error Handling

Gestisci sempre gli errori MQTT:

```typescript
try {
  const mqttPositions = this.mqttService.positionVeiclesList();
  // ...
} catch (error) {
  console.error('Error:', error);
  return null;
}
```

### 4. Normalizza Stati

Converti stati in formato standard:

```typescript
private normalizeStatus(s: string): string {
  const v = (s ?? '').toLowerCase().trim();
  if (v === 'online') return 'active';
  if (v === 'offline') return 'inactive';
  return v;
}
```

### 5. Logging

Usa log descrittivi per debugging:

```typescript
console.log(`📦 Loaded ${response.items.length} vehicles from database`);
console.log(`📡 MQTT data: ${mqttPositions.length} positions`);
console.log(`🔄 Vehicle ${v.id}: Status updated from '${v.status}' to '${normalizedStatus}'`);
```

---

## 🐛 Troubleshooting

### I veicoli non si aggiornano

1. **Verifica connessione MQTT:**

   ```typescript
   console.log('MQTT connected:', this.mqttService.isConnected());
   ```

2. **Controlla subscriptions:**

   ```typescript
   // Verifica che i messaggi arrivino
   this.mqttService.subscribeAndTrack('vehicles/+/status', (msg) => {
     console.log('Received:', msg);
   });
   ```

3. **Controlla timestamp:**
   ```typescript
   console.log('MQTT timestamp:', tPos);
   console.log('DB timestamp:', tDb);
   console.log('MQTT is newer:', tPos > tDb);
   ```

### Le posizioni non sono accurate

1. **Verifica formato MQTT:**

   - Latitude e longitude devono essere numeri (non stringhe)
   - Timestamp deve essere valido

2. **Controlla merge logic:**
   ```typescript
   if (p && tPos > tDb) {
     console.log('Using MQTT position:', p);
     next.lastPosition = p;
   }
   ```

### Auto-update non funziona

1. **Verifica interval:**

   ```typescript
   console.log('Auto-update interval:', this.autoUpdateInterval);
   ```

2. **Controlla lifecycle:**
   - `startAutoUpdate()` viene chiamato in `ngOnInit()`
   - `stopAutoUpdate()` viene chiamato in `ngOnDestroy()`

---

## 📚 Riferimenti

- **Leaflet Documentation:** https://leafletjs.com/
- **MQTT.js:** https://github.com/mqttjs/MQTT.js
- **Angular Signals:** https://angular.io/guide/signals

---

## 🎉 Conclusione

Il sistema di posizionamento ibrido DB + MQTT garantisce:

- ✅ Dati persistenti dal database
- ✅ Aggiornamenti in tempo reale via MQTT
- ✅ Merge intelligente basato su timestamp
- ✅ Performance ottimizzate con Angular Signals
- ✅ UI reattiva con auto-update
- ✅ Feedback utente con toast notifications

Questo approccio bilancia **affidabilità** (database) e **reattività** (MQTT) per un'esperienza utente ottimale.
