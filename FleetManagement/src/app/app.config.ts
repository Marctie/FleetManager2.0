import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
  provideZoneChangeDetection,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { authInterceptor } from './interceptors/auth.interceptor';

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(withFetch(), withInterceptors([authInterceptor])),
  ],

  const MQTT_SERVICE_OPTIONS: IMqttServiceOptions = {  protocol: 'wss',           
    // 'ws' in dev se non TLS  hostname: 'broker.example.com',  
    // port: 443,                  
    // // 443 per wss  path: '/mqtt',  
    // connectOnCreate: false,     
    // // connetti manualmente dal service  // 
    // optional: username, password, clientId, clean, keepalive, wsOptions, etc.};
    // export const appConfig: ApplicationConfig = {  providers: [    provideRouter(routes),    importProvidersFrom(MqttModule.forRoot(MQTT_SERVICE_OPTIONS)),  ],};
 
};
