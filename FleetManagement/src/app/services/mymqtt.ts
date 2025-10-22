import { inject, Injectable, signal } from '@angular/core';
import { IVehicle } from '../models/IVehicle';
import { Observable, Subscription } from 'rxjs';
import { IMqttMessage, MqttService } from 'ngx-mqtt';


@Injectable({
  providedIn: 'root',
})
export class mymqtt {
  mqtt = inject(MqttService);
  vehicleList = signal<IVehicle[]>([]);
 private subs = new Map<string, Subscription>();
  configMqtt = inject (mqtt)
 topicSubscribe(topic:string):void{
    return this.mqtt.doSubscribe(topic);
 }

  createConnection() {
    this.mqtt.connect(this.mqtt);

    this.mqtt.onConnect.subscribe(() => {
      this.isConnection.set(true);
    });

    this.mqtt.onError.subscribe((error) => {
      this.isConnection.set(false);
    });
  }

  doSubscribe(topic:string){
    const {topic, qos} =this.subscription;
    this.curSubscription = this.client.observe (topic, {qos} as IVehicle.subscribe((message:IMqttMessage)=> {this.subscribeSuccess.set(true);console.log('Ricevuto:', message.payload.toString());}))
  }
}
