import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { IAppConfig } from '../models/IAppConfig';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ConfigService {
  private config!: IAppConfig;

  constructor(private http: HttpClient) {}

  async loadConfig(): Promise<IAppConfig> {
    try {
      this.config = await firstValueFrom(this.http.get<IAppConfig>('assets/config.json'));
      return this.config;
    } catch (error) {
      console.error('Errore nel caricamento della configurazione:', error);
      throw error;
    }
  }

  getConfig(): IAppConfig {
    if (!this.config) {
      throw new Error('Configurazione non caricata. Chiamare loadConfig() prima.');
    }
    return this.config;
  }

  getMqttConfig() {
    return this.getConfig().mqtt;
  }

  getApiConfig() {
    return this.getConfig().apiConfig;
  }

  getEndpoints() {
    return this.getConfig().endpoints;
  }

  getEnums() {
    return this.getConfig().enums;
  }
}
