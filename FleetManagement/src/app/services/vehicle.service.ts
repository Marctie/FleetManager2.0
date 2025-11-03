import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IVehicle } from '../models/IVehicle';
import { ConfigService } from './config.service';

@Injectable({
  providedIn: 'root',
})
export class VehicleService {
  private http = inject(HttpClient);
  private configService = inject(ConfigService);

  private get VEHICLE_ENDPOINTS() {
    const baseUrl = this.configService.getApiBaseUrl();
    return {
      list: `${baseUrl}/api/Vehicles`,
      create: `${baseUrl}/api/Vehicles`,
      update: `${baseUrl}/api/Vehicles`,
    };
  }

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

  /**
   * Aggiorna un veicolo esistente
   * @returns Observable<IVehicle> Il veicolo aggiornato
   */
  updateVehicle(vehicle: IVehicle): Observable<IVehicle> {
    const updateData = {
      brand: vehicle.brand,
      model: vehicle.model,
      year: vehicle.year,
      currentKm: vehicle.currentKm,
      fuelType: Number(vehicle.fuelType),
      status: vehicle.status,
      lastMaintenanceDate: vehicle.lastMaintenanceDate,
      insuranceExpiryDate: vehicle.insuranceExpiryDate,
    };

    return this.http.put<IVehicle>(`${this.VEHICLE_ENDPOINTS.update}/${vehicle.id}`, updateData);
  }

  /**
   * Aggiorna lo stato di un veicolo
   * @param id L'ID del veicolo
   * @returns Observable<IVehicle> Il veicolo aggiornato
   */
  updateVehicleStatus(id: number, status: string): Observable<IVehicle> {
    return this.http.patch<IVehicle>(`${this.VEHICLE_ENDPOINTS.update}/${id}/status`, { status });
  }

  /**
   * Elimina un veicolo
   */
  deleteVehicle(id: number): Observable<void> {
    return this.http.delete<void>(`${this.VEHICLE_ENDPOINTS.list}/${id}`);
  }

  /**
   * Ottiene i dati di telemetria (posizione GPS) per un veicolo specifico
   */
  getVehicleTelemetry(vehicleId: number): Observable<{
    vehicleId: number;
    latitude: number;
    longitude: number;
    speed: number;
    heading: number;
    timestamp: Date;
    status: string;
  }> {
    const baseUrl = this.configService.getApiBaseUrl();
    return this.http.get<{
      vehicleId: number;
      latitude: number;
      longitude: number;
      speed: number;
      heading: number;
      timestamp: Date;
      status: string;
    }>(`${baseUrl}/api/Telemetry/vehicle/${vehicleId}`);
  }

  /**
   * Ottiene i dati di telemetria per tutti i veicoli
   * Utile per caricare le posizioni iniziali sulla mappa
   * @returns Observable<Array> con i dati di telemetria di tutti i veicoli
   */
  getAllVehiclesTelemetry(): Observable<
    Array<{
      vehicleId: number;
      latitude: number;
      longitude: number;
      speed: number;
      heading: number;
      timestamp: Date;
      status: string;
    }>
  > {
    const baseUrl = this.configService.getApiBaseUrl();
    return this.http.get<
      Array<{
        vehicleId: number;
        latitude: number;
        longitude: number;
        speed: number;
        heading: number;
        timestamp: Date;
        status: string;
      }>
    >(`${baseUrl}/api/Telemetry/vehicles`);
  }
}
