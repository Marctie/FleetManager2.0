# ✅ MQTT Topic Update - Single Topic Implementation

## Modifiche Apportate

### 🎯 Obiettivo

Semplificare il sistema MQTT usando un **unico topic** `vehicles/#` invece di multiple subscriptions.

---

## 📝 File Modificati

### 1. **mqtt.service.ts**

#### Prima:

```typescript
private readonly TOPICS = {
  VEHICLE_STATS: 'fleet/stats',
  VEHICLE_LOCATIONS: 'fleet/locations',
  VEHICLE_STATUS: 'fleet/status/#',
};

// Multiple subscriptions
topics.forEach((topic) => {
  this.client!.subscribe(topic, { qos: 1 }, ...);
});
```

#### Dopo:

```typescript
private readonly TOPICS = {
  ALL_VEHICLES: 'vehicles/#', // Un solo topic
};

// Single subscription
const topic = this.TOPICS.ALL_VEHICLES;
this.client.subscribe(topic, { qos: 1 }, ...);
```

#### Nuovo Handler Messaggi:

```typescript
private handleMessage(topic: string, payload: Buffer): void {
  const message = JSON.parse(payload.toString());

  // Routing basato sul topic
  if (topic.includes('/status')) {
    this.updateVehicleStatus(message);
  } else if (topic.includes('/position')) {
    this.updateVehicleLocation(message);
  } else if (topic.includes('/stats')) {
    this.vehicleStatsSubject.next(message);
  }
}
```

#### Nuovo Metodo Aggiunto:

```typescript
private updateVehicleLocation(locationMessage: any): void {
  const currentLocations = this.vehicleLocationsSubject.value;
  const existingIndex = currentLocations.findIndex(
    (vehicle) => vehicle.vehicleId === locationMessage.vehicleId
  );

  if (existingIndex >= 0) {
    // Update existing
    const updatedLocations = [...currentLocations];
    updatedLocations[existingIndex] = {
      ...updatedLocations[existingIndex],
      ...locationMessage
    };
    this.vehicleLocationsSubject.next(updatedLocations);
  } else {
    // Add new
    this.vehicleLocationsSubject.next([...currentLocations, locationMessage]);
  }
}
```

---

### 2. **general-map.ts**

#### Prima:

```typescript
// Due subscriptions separate
this.mqttService.subscribeAndTrack('vehicles/+/status', (msg) => {
  this.mqttService.ingestStatusMessage(msg);
});

this.mqttService.subscribeAndTrack('vehicles/+/position', (msg) => {
  this.mqttService.ingestPositionMessage(msg);
});
```

#### Dopo:

```typescript
// Una sola subscription con routing intelligente
this.mqttService.subscribeAndTrack('vehicles/#', (msg) => {
  try {
    const payload = JSON.parse(msg.payload.toString());
    const topic = msg.topic;

    console.log(`📨 MQTT message on topic '${topic}':`, payload);

    // Routing basato sul contenuto del topic
    if (topic.includes('/status')) {
      console.log('  └─ Type: STATUS');
      this.mqttService.ingestStatusMessage(msg);
    } else if (topic.includes('/position')) {
      console.log('  └─ Type: POSITION');
      this.mqttService.ingestPositionMessage(msg);
    } else {
      console.log('  └─ Type: UNKNOWN - Ignoring');
    }
  } catch (error) {
    console.error('❌ Error processing MQTT message:', error);
  }
});
```

---

### 3. **MQTT_POSITION_SYSTEM.md**

Aggiornata la documentazione per riflettere:

- Topic unico `vehicles/#`
- Vantaggi del wildcard `#` vs `+`
- Nuova struttura di routing

---

## 🎯 Vantaggi del Topic Unico

### ✅ Performance

- **1 subscription** invece di 2+
- Meno overhead sul broker MQTT
- Ridotto network traffic per la sottoscrizione

### ✅ Scalabilità

- Cattura automaticamente **nuovi tipi di messaggi** futuri
- Non serve modificare il codice per aggiungere `vehicles/123/battery` o altri

### ✅ Manutenibilità

- Codice più semplice e pulito
- Un solo punto di gestione subscription
- Routing centralizzato nel callback

### ✅ Flessibilità

- Può gestire topic con struttura variabile
- Supporta topic multilivello: `vehicles/123/sensors/temperature`

---

## 📊 Wildcard MQTT: `+` vs `#`

| Wildcard | Descrizione     | Esempio             | Match                                                                                    |
| -------- | --------------- | ------------------- | ---------------------------------------------------------------------------------------- |
| `+`      | Un solo livello | `vehicles/+/status` | `vehicles/123/status` ✅<br>`vehicles/123/position` ❌                                   |
| `#`      | Tutti i livelli | `vehicles/#`        | `vehicles/123/status` ✅<br>`vehicles/123/position` ✅<br>`vehicles/123/sensors/temp` ✅ |

**Scelta consigliata:** `#` per massima flessibilità

---

## 🔄 Flusso Messaggi

```
MQTT Broker
    │
    ├─ vehicles/123/status ──────┐
    ├─ vehicles/123/position ────┤
    ├─ vehicles/456/status ──────┤
    └─ vehicles/456/position ────┤
                                  │
                          vehicles/# (subscribe)
                                  │
                                  ▼
                         MqttService.handleMessage()
                                  │
                    ┌─────────────┼─────────────┐
                    │             │             │
              includes('/status') │      includes('/position')
                    │             │             │
                    ▼             ▼             ▼
         updateVehicleStatus  (other)  updateVehicleLocation
                    │                           │
                    └─────────┬─────────────────┘
                              │
                              ▼
                    vehicleLocationsSubject
                              │
                              ▼
                        General Map Component
```

---

## 🧪 Testing

### Verifica Subscription

```typescript
// In console browser, dopo connessione MQTT
console.log('Connected:', mqttService.isConnected());
```

### Simula Messaggi

```bash
# Pubblica status
mosquitto_pub -h broker.example.com -t "vehicles/123/status" -m '{"vehicleId":123,"status":"online","timestamp":"2025-10-20T15:30:00Z"}'

# Pubblica position
mosquitto_pub -h broker.example.com -t "vehicles/123/position" -m '{"vehicleId":123,"latitude":41.9028,"longitude":12.4964,"speed":60,"heading":180,"timestamp":"2025-10-20T15:30:00Z"}'
```

### Controlla Logs

```typescript
// Dovresti vedere:
📨 MQTT message on topic 'vehicles/123/status': {...}
  └─ Type: STATUS

📨 MQTT message on topic 'vehicles/123/position': {...}
  └─ Type: POSITION
```

---

## ✅ Checklist Completamento

- [x] Aggiornato `mqtt.service.ts` con topic unico
- [x] Aggiunto metodo `updateVehicleLocation()`
- [x] Aggiornato `general-map.ts` con routing intelligente
- [x] Aggiornata documentazione `MQTT_POSITION_SYSTEM.md`
- [x] Rimossi topic duplicati/obsoleti
- [x] Aggiunto error handling nel routing
- [x] Log dettagliati per debugging
- [x] Nessun errore di compilazione

---

## 🚀 Prossimi Passi

1. **Test con broker MQTT reale**

   - Verifica ricezione messaggi status
   - Verifica ricezione messaggi position
   - Controlla aggiornamento mappa in tempo reale

2. **Monitoraggio Performance**

   - Misura latenza messaggi MQTT
   - Verifica utilizzo memoria con molti veicoli
   - Ottimizza refresh rate se necessario

3. **Possibili Estensioni**
   - `vehicles/123/battery` - Livello batteria
   - `vehicles/123/fuel` - Livello carburante
   - `vehicles/123/sensors/*` - Dati sensori

Tutte queste saranno catturate automaticamente da `vehicles/#`! 🎉

---

## 📚 Riferimenti

- **MQTT Wildcards:** https://www.hivemq.com/blog/mqtt-essentials-part-5-mqtt-topics-best-practices/
- **MQTT.js Topics:** https://github.com/mqttjs/MQTT.js#subscribe
- **Best Practices:** Usa `#` per flessibilità, `+` per controllo specifico
