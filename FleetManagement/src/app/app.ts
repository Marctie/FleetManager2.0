import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MqttService } from './services/mymqtt';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  template: `<router-outlet />`,
  styles: ``,
})
export class App implements OnInit {
  protected readonly title = signal('FleetManagement');
  mqttService = inject(MqttService);
  ngOnInit(): void {
    console.log(' app.ts ');
  }

  detectMqttMessage(): void {
    const topic = 'vehicles/#';
    this.mqttService.topicSubscribe(topic).subscribe({
      next: (response: IMqttMessage) => {
        const message: VeiclePosition = JSON.parse(response.payload.toString());
        console.log('MQTT messaggio ricevuto:', message);

        // 1. Salva nel localStorage
        const rawLista = localStorage.getItem('lista');
        let lista: VeiclePosition[] = rawLista ? JSON.parse(rawLista) : [];

      
        // 2. Aggiorna anche il signal del servizio MQTT per uso immediato
        this.updateMqttServiceSignal(lista);
      },
      error: (error) => {
        console.error(' Errore MQTT:', error);
      },
    });
  }
}
