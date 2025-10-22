import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MqttService } from './services/mqtt.service';

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
    this.mqttService.connect();

    setTimeout(() => {
      this.mqttService.topicSubscribe('vehicles/#');
    }, 1000);
  }
}
