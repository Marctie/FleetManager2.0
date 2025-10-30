import { inject, Injectable, signal, OnDestroy } from '@angular/core';
import { IVehicle } from '../models/IVehicle';
import { Observable, Subject, Subscription } from 'rxjs';
import { IMqttMessage, MqttService, IPublishOptions } from 'ngx-mqtt';
import { ConfigService } from './config.service';

@Injectable({
  providedIn: 'root',
})
export class MyMqttService implements OnDestroy {
  private mqtt = inject(MqttService);
  private configService = inject(ConfigService);

  // Signals per lo stato
  vehicleList = signal<IVehicle[]>([]);
  isConnection = signal<boolean>(false);
  subscribeSuccess = signal<boolean>(false);

  // Gestione delle sottoscrizioni
  private subs = new Map<string, Subscription>();

  // Subject per i messaggi ricevuti
  private messages$ = new Subject<{ topic: string; message: any }>();

  constructor() {}

  /**
   * Crea la connessione al broker MQTT usando la configurazione da config.json
   */
  createConnection(): void {
    const mqttConfig = this.configService.getConfig();

    console.log('Connessione a MQTT:');

    // gestisce la connessione automaticamente,
    // dobbiamo solo ascoltare gli eventi
    this.mqtt.onConnect.subscribe(() => {
      console.log('Connesso al broker MQTT');
      this.isConnection.set(true);
    });

    this.mqtt.onError.subscribe((error) => {
      console.error('Errore connessione MQTT:', error);
      this.isConnection.set(false);
    });

    this.mqtt.onClose.subscribe(() => {
      console.log('Connessione MQTT chiusa');
      this.isConnection.set(false);
    });

    this.mqtt.onReconnect.subscribe(() => {
      console.log('Tentativo di riconnessione MQTT...');
    });
  }

  /**
   * Sottoscrive un topic MQTT
   * @param topic - Il topic da sottoscrivere
   * @param qos - Quality of Service (0, 1, o 2)
   * @returns Observable con i messaggi ricevuti
   */
  doSubscribe(topic: string, qos: 0 | 1 | 2 = 0): Observable<IMqttMessage> {
    console.log(`Sottoscrizione al topic: ${topic} con QoS: ${qos}`);

    const subscription = this.mqtt.observe(topic, { qos }).subscribe(
      (message: IMqttMessage) => {
        this.subscribeSuccess.set(true);
        console.log(`Messaggio ricevuto su ${topic}:`, message.payload.toString());

        // Emetti il messaggio tramite Subject
        this.messages$.next({
          topic: message.topic,
          message: message.payload.toString(),
        });

        // Se è un messaggio relativo ai veicoli, aggiorna la lista
        if (topic.includes('vehicle') || topic.includes('telemetry')) {
          this.handleVehicleMessage(message);
        }
      },
      (error) => {
        console.error(`Errore nella sottoscrizione a ${topic}:`, error);
        this.subscribeSuccess.set(false);
      }
    );

    // Salva la sottoscrizione per poterla cancellare dopo
    this.subs.set(topic, subscription);

    return this.mqtt.observe(topic, { qos });
  }

  /**
   * Annulla la sottoscrizione da un topic
   * @param topic - Il topic da cui annullare la sottoscrizione
   */
  unsubscribe(topic: string): void {
    const sub = this.subs.get(topic);
    if (sub) {
      sub.unsubscribe();
      this.subs.delete(topic);
      console.log(`Annullata sottoscrizione da: ${topic}`);
    }
  }

  /**
   * Pubblica un messaggio su un topic
   * @param topic - Il topic su cui pubblicare
   * @param message - Il messaggio da pubblicare
   * @param qos - Quality of Service (0, 1, o 2)
   * @param retain - Se true, il messaggio sarà retained dal broker
   */
  publish(
    topic: string,
    message: string | object,
    qos: 0 | 1 | 2 = 0,
    retain: boolean = false
  ): void {
    const payload = typeof message === 'object' ? JSON.stringify(message) : message;
    const options: IPublishOptions = { qos, retain };

    this.mqtt.unsafePublish(topic, payload, options);
    console.log(`Messaggio pubblicato su ${topic}:`, payload);
  }

  /**
   * Gestisce i messaggi relativi ai veicoli
   * @param message - Il messaggio MQTT ricevuto
   */
  private handleVehicleMessage(message: IMqttMessage): void {
    try {
      const data = JSON.parse(message.payload.toString());

      // Aggiorna la lista dei veicoli in base al messaggio
      // Questa logica dipende dalla struttura dei tuoi messaggi MQTT
      if (data && data.vehicleId) {
        console.log('Dati veicolo ricevuti:', data);
        // Qui puoi aggiornare vehicleList in base ai tuoi requisiti
      }
    } catch (error) {
      console.error('Errore nel parsing del messaggio veicolo:', error);
    }
  }

  /**
   * Observable per ricevere tutti i messaggi MQTT
   */
  getMessages(): Observable<{ topic: string; message: any }> {
    return this.messages$.asObservable();
  }

  /**
   * Verifica se è connesso al broker
   */
  isConnected(): boolean {
    return this.isConnection();
  }

  /**
   * Ottiene la lista delle sottoscrizioni attive
   */
  getActiveSubscriptions(): string[] {
    return Array.from(this.subs.keys());
  }

  /**
   * Cleanup quando il service viene distrutto
   */
  ngOnDestroy(): void {
    console.log('Chiusura di tutte le sottoscrizioni MQTT...');

    // Cancella tutte le sottoscrizioni
    this.subs.forEach((sub, topic) => {
      sub.unsubscribe();
      console.log(`Sottoscrizione cancellata: ${topic}`);
    });

    this.subs.clear();
    this.messages$.complete();
  }
}
