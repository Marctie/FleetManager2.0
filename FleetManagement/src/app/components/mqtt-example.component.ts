import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MyMqttService } from '../services/mymqtt';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-mqtt-example',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="mqtt-container">
      <h2>MQTT Connection Status</h2>

      <div class="status">
        <p>
          Connesso:
          <span
            [class.connected]="mqttService.isConnection()"
            [class.disconnected]="!mqttService.isConnection()"
          >
            {{ mqttService.isConnection() ? 'Sì' : 'No' }}
          </span>
        </p>
      </div>

      <div class="actions">
        <button (click)="connect()">Connetti</button>
        <button (click)="subscribeTelemetry()">Sottoscrivi Telemetria</button>
        <button (click)="publishTest()">Pubblica Test</button>
        <button (click)="unsubscribeAll()">Annulla Tutte</button>
      </div>

      <div class="subscriptions">
        <h3>Sottoscrizioni Attive:</h3>
        <ul>
          @for (topic of activeTopics; track topic) {
          <li>{{ topic }}</li>
          }
        </ul>
      </div>

      <div class="messages">
        <h3>Ultimi Messaggi:</h3>
        <ul>
          @for (msg of messages; track msg.timestamp) {
          <li>
            <strong>{{ msg.topic }}:</strong> {{ msg.message }}
            <small>({{ msg.timestamp | date : 'medium' }})</small>
          </li>
          }
        </ul>
      </div>

      <div class="vehicles">
        <h3>Veicoli ({{ mqttService.vehicleList().length }}):</h3>
        <ul>
          @for (vehicle of mqttService.vehicleList(); track vehicle.id) {
          <li>{{ vehicle.licensePlate }} - {{ vehicle.brand }} {{ vehicle.model }}</li>
          }
        </ul>
      </div>
    </div>
  `,
  styles: [
    `
      .mqtt-container {
        padding: 20px;
        font-family: Arial, sans-serif;
      }

      .status {
        margin: 20px 0;
        padding: 15px;
        background: #f5f5f5;
        border-radius: 5px;
      }

      .connected {
        color: green;
        font-weight: bold;
      }

      .disconnected {
        color: red;
        font-weight: bold;
      }

      .actions {
        margin: 20px 0;
      }

      .actions button {
        margin-right: 10px;
        padding: 10px 20px;
        background: #007bff;
        color: white;
        border: none;
        border-radius: 5px;
        cursor: pointer;
      }

      .actions button:hover {
        background: #0056b3;
      }

      .subscriptions,
      .messages,
      .vehicles {
        margin: 20px 0;
      }

      ul {
        list-style: none;
        padding: 0;
      }

      li {
        padding: 10px;
        margin: 5px 0;
        background: #f9f9f9;
        border-left: 3px solid #007bff;
        border-radius: 3px;
      }

      small {
        color: #666;
        margin-left: 10px;
      }
    `,
  ],
})
export class MqttExampleComponent implements OnInit, OnDestroy {
  mqttService = inject(MyMqttService);

  activeTopics: string[] = [];
  messages: Array<{ topic: string; message: string; timestamp: Date }> = [];
  private messagesSub?: Subscription;

  ngOnInit(): void {
    // Sottoscrivi ai messaggi
    this.messagesSub = this.mqttService.getMessages().subscribe((msg) => {
      this.messages.unshift({
        topic: msg.topic,
        message: msg.message,
        timestamp: new Date(),
      });

      // Mantieni solo gli ultimi 10 messaggi
      if (this.messages.length > 10) {
        this.messages.pop();
      }
    });

    // Aggiorna la lista dei topic attivi
    this.updateActiveTopics();
  }

  connect(): void {
    this.mqttService.createConnection();
  }

  subscribeTelemetry(): void {
    // Esempio di sottoscrizione a topic di telemetria
    const topics = ['fleet/telemetry/#', 'fleet/vehicles/+/location', 'fleet/vehicles/+/status'];

    topics.forEach((topic) => {
      this.mqttService.doSubscribe(topic, 0);
    });

    this.updateActiveTopics();
  }

  publishTest(): void {
    const testMessage = {
      vehicleId: 1,
      licensePlate: 'AB123CD',
      location: {
        lat: 41.9028,
        lng: 12.4964,
      },
      speed: 60,
      timestamp: new Date().toISOString(),
    };

    this.mqttService.publish('fleet/vehicles/1/telemetry', testMessage, 0, false);
  }

  unsubscribeAll(): void {
    const topics = this.mqttService.getActiveSubscriptions();
    topics.forEach((topic) => {
      this.mqttService.unsubscribe(topic);
    });
    this.updateActiveTopics();
  }

  private updateActiveTopics(): void {
    this.activeTopics = this.mqttService.getActiveSubscriptions();
  }

  ngOnDestroy(): void {
    if (this.messagesSub) {
      this.messagesSub.unsubscribe();
    }
  }
}
