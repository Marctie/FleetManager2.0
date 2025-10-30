import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IVehicle } from '../models/IVehicle';

@Injectable({
  providedIn: 'root',
})
export class VehicleService {
  private http = inject(HttpClient);

  private readonly API_BASE_URL = 'http://10.0.90.9/Stage/FleetManagement';
  private readonly VEHICLE_ENDPOINTS = {
    list: `${this.API_BASE_URL}/api/Vehicles`,
    create: `${this.API_BASE_URL}/api/Vehicles`,
  };

  /**
   * Lista veicoli con opzioni di filtro
   * @param options Opzioni di filtro (ricerca, stato, modello)
   * @returns Observable<IVehicle[]>
   */
  getListVehicles(options?: {
    page?: number;
    pageSize?: number;
    search?: string;
    status?: string;
    model?: string;
  }): Observable<IVehicle[]> {
    const params = new URLSearchParams();

    // Imposta i parametri di paginazione di default
    params.append('page', (options?.page || 1).toString());
    params.append('pageSize', (options?.pageSize || 1000).toString());

    // Aggiungi i parametri di filtro se presenti
    if (options?.search) params.append('search', options.search);
    if (options?.status) params.append('status', options.status);
    if (options?.model) params.append('model', options.model);

    return this.http.get<IVehicle[]>(`${this.VEHICLE_ENDPOINTS.list}?${params.toString()}`);
  }

  /**
   *Lista veicoli con id
   */
  getVehicleById(id: number): Observable<IVehicle> {
    return this.http.get<IVehicle>(`${this.VEHICLE_ENDPOINTS.list}/${id}`);
  }

  /**
   * Crea un nuovo veicolo
   * @param vehicle I dati del veicolo da creare
   * @returns Observable<IVehicle> Il veicolo creato
   */
  createVehicle(vehicle: Partial<IVehicle>): Observable<IVehicle> {
    return this.http.post<IVehicle>(this.VEHICLE_ENDPOINTS.create, vehicle);
  }
}
