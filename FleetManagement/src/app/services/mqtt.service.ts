import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import mqtt from 'mqtt';

@Injectable({
  providedIn: 'root',
})
export class MqttService {
  private client: mqtt.MqttClient | null = null;
  private connected = false;
  private connectionStatusSubject = new BehaviorSubject<boolean>(false);
  public connectionStatus$ = this.connectionStatusSubject.asObservable();
  private mqttConfig: any = null;

  constructor() {
    console.log('MQTT Service initialized');
  }

  private async loadConfiguration(): Promise<void> {
    try {
      const response = await fetch('/assets/config.json');
      const config = await response.json();

      if (config.mqtt) {
        this.mqttConfig = {
          brokerUrl: config.mqtt.brokerUrl,
          username: config.mqtt.username,
          password: config.mqtt.password,
          keepalive: config.mqtt.keepalive || 120,
          reconnectPeriod: 1000,
          connectTimeout: 30000,
        };
        console.log('MQTT configuration loaded');
      }
    } catch (error) {
      console.error('Error loading MQTT configuration:', error);
      this.mqttConfig = {
        brokerUrl: 'wss://rabbitmq.test.intellitronika.com/ws',
        username: 'intellitronika',
        password: 'intellitronika',
        keepalive: 120,
        reconnectPeriod: 1000,
        connectTimeout: 30000,
      };
    }
  }

  async connect(): Promise<void> {
    console.log('connect is ready');
    if (this.connected) {
      console.log('Already connected');
      return;
    }

    if (!this.mqttConfig) {
      await this.loadConfiguration();
    }

    if (!this.mqttConfig) {
      console.error('No MQTT configuration available');
      return;
    }

    try {
      this.client = mqtt.connect(this.mqttConfig.brokerUrl, {
        username: this.mqttConfig.username,
        password: this.mqttConfig.password,
        keepalive: this.mqttConfig.keepalive,
        reconnectPeriod: this.mqttConfig.reconnectPeriod,
        connectTimeout: this.mqttConfig.connectTimeout,
        clean: true,
        protocol: 'wss',
      });

      this.setupEventHandlers();
    } catch (error) {
      console.error('Error connecting to MQTT:', error);
      this.connectionStatusSubject.next(false);
    }
  }

  private setupEventHandlers(): void {
    console.log(this.client, 'printclient');
    if (!this.client) return;

    this.client.on('connect', () => {
      console.log('Connected to MQTT broker');
      this.connected = true;
      this.connectionStatusSubject.next(true);

      // Sottoscrivi automaticamente ai topic dopo la connessione
      this.subscribeToDefaultTopics();
    });

    this.client.on('message', (topic: string, payload: Buffer) => {
      console.log('MQTT Message [' + topic + ']:', payload.toString());
      // Qui puoi parsare il payload e aggiornare lo stato dell'applicazione
      try {
        const data = JSON.parse(payload.toString());
        console.log('Parsed MQTT data:', data);
      } catch (error) {
        console.warn('Could not parse MQTT message as JSON:', error);
      }
    });

    this.client.on('error', (error) => {
      console.error('MQTT Error:', error);
      this.connectionStatusSubject.next(false);
    });

    this.client.on('close', () => {
      console.log('MQTT Connection closed');
      this.connected = false;
      this.connectionStatusSubject.next(false);
    });
  }

  private subscribeToDefaultTopics(): void {
    // Sottoscrivi ai topic di default per la flotta
    const defaultTopics = [
      'vehicles/#', // Posizioni di tutti i veicoli
    ];

    defaultTopics.forEach((topic) => {
      this.topicSubscribe(topic);
    });
  }

  topicSubscribe(topic: string): void {
    if (!this.client || !this.connected) {
      console.warn('Cannot subscribe: Not connected');
      return;
    }

    this.client.subscribe(topic, { qos: 1 }, (error) => {
      if (error) {
        console.error('Error subscribing to ' + topic + ':', error);
      } else {
        console.log('Subscribed to topic: ' + topic);
      }
    });
  }

  topicPublish(topic: string, message: string): void {
    if (!this.client || !this.connected) {
      console.warn('Cannot publish: Not connected');
      return;
    }

    this.client.publish(topic, message, { qos: 1 }, (error) => {
      if (error) {
        console.error('Error publishing to ' + topic + ':', error);
      } else {
        console.log('Published to ' + topic);
      }
    });
  }

  disconnect(): void {
    if (this.client && this.connected) {
      this.client.end();
      this.connected = false;
      this.connectionStatusSubject.next(false);
    }
  }

  isConnected(): boolean {
    return this.connected;
  }
}
