import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, tap, catchError } from 'rxjs/operators';
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
   * Lista veicoli con opzioni di filtro e paginazione
   * @param options Opzioni di filtro (ricerca, stato, modello, paginazione)
   * @returns Observable<IVehicleRes> con items, total, page, pageSize
   */
  getListVehicles(options?: {
    page?: number;
    pageSize?: number;
    search?: string;
    status?: string;
    model?: string;
  }): Observable<{
    items: IVehicle[];
    status: string;
    total: number;
    page: number;
    pageSize: number;
  }> {
    const params = new URLSearchParams();

    // Imposta i parametri di paginazione di default
    const page = options?.page || 1;
    const pageSize = options?.pageSize || 20;

    params.append('page', page.toString());
    params.append('pageSize', pageSize.toString());

    // Aggiungi i parametri di filtro se presenti
    if (options?.search) params.append('search', options.search);
    if (options?.status) params.append('status', options.status);
    if (options?.model) params.append('model', options.model);

    console.log('[VehicleService] Fetching vehicles with params:', {
      page,
      pageSize,
      search: options?.search,
      status: options?.status,
      model: options?.model
    });

    return this.http.get<any>(`${this.VEHICLE_ENDPOINTS.list}?${params.toString()}`).pipe(
      map((response: any) => {
        // Normalize page values for reuse
        const pageNum = page;
        const pageSz = pageSize;

        // Se l'API restituisce già il formato paginato
        if (response && typeof response === 'object' && 'items' in response) {
          const items = (response.items ?? []) as IVehicle[];
          console.log('[VehicleService] Vehicles received (paginated):', {
            count: items.length,
            total: response.total,
            statuses: items.map(v => ({ id: v.id, licensePlate: v.licensePlate, status: v.status }))
          });
          return {
            items: items,
            status: typeof response.status === 'string' ? response.status : '',
            total: typeof response.total === 'number' ? response.total : items.length,
            page: typeof response.page === 'number' ? response.page : pageNum,
            pageSize: typeof response.pageSize === 'number' ? response.pageSize : pageSz,
          };
        }

        if (Array.isArray(response)) {
          console.log('[VehicleService] Vehicles received (array):', {
            count: response.length,
            statuses: response.map((v: IVehicle) => ({ id: v.id, licensePlate: v.licensePlate, status: v.status }))
          });
          return {
            items: response as IVehicle[],
            status: '',
            total: response.length,
            page: pageNum,
            pageSize: pageSz,
          };
        }

        console.warn('[VehicleService] Unexpected response format:', response);
        return {
          items: [] as IVehicle[],
          status: '',
          total: 0,
          page: pageNum,
          pageSize: pageSz,
        };
      })
    );
  }

  /**
   *Lista veicoli con id
   */
  getVehicleById(id: number | string): Observable<IVehicle> {
    return this.http.get<IVehicle>(`${this.VEHICLE_ENDPOINTS.list}/${id}`);
  }

  /**
   * Crea un nuovo veicolo
   * @param vehicle I dati del veicolo da creare
   * @returns Observable<IVehicle> Il veicolo creato
   */
  createVehicle(vehicle: Partial<IVehicle>): Observable<IVehicle> {
    console.log('[VehicleService] Creating vehicle:', {
      brand: vehicle.brand,
      model: vehicle.model,
      status: vehicle.status,
      fullPayload: vehicle
    });
    return this.http.post<IVehicle>(this.VEHICLE_ENDPOINTS.create, vehicle).pipe(
      tap((response) => console.log('[VehicleService] Vehicle created successfully:', response)),
      catchError((error) => {
        console.error('[VehicleService] Error creating vehicle:', error);
        throw error;
      })
    );
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

    console.log('[VehicleService] Updating vehicle:', {
      vehicleId: vehicle.id,
      status: vehicle.status,
      fullPayload: updateData
    });

    return this.http.put<IVehicle>(`${this.VEHICLE_ENDPOINTS.update}/${vehicle.id}`, updateData).pipe(
      tap((response) => console.log('[VehicleService] Vehicle updated successfully:', response)),
      catchError((error) => {
        console.error('[VehicleService] Error updating vehicle:', error);
        throw error;
      })
    );
  }

  /**
   * Aggiorna lo stato di un veicolo
   */
  updateVehicleStatus(id: number | string, status: string): Observable<IVehicle> {
    const url = `${this.VEHICLE_ENDPOINTS.update}/${id}/status`;
    console.log('[VehicleService] Updating vehicle status:', {
      vehicleId: id,
      status: status,
      endpoint: url
    });
    return this.http.patch<IVehicle>(url, status).pipe(
      tap((response) => console.log('[VehicleService] Status updated successfully:', response)),
      catchError((error) => {
        console.error('[VehicleService] Error updating status:', error);
        throw error;
      })
    );
  }

  /**
   * Elimina un veicolo
   */
  deleteVehicle(id: number | string): Observable<void> {
    return this.http.delete<void>(`${this.VEHICLE_ENDPOINTS.list}/${id}`);
  }

  /**
   * Assegna un veicolo a un driver
   */
  assignVehicle(vehicleId: number | string, driverId: string, notes?: string): Observable<any> {
    const baseUrl = this.configService.getApiBaseUrl();
    const url = `${baseUrl}/api/Assignments`;

    const payload: any = {
      vehicleId: vehicleId.toString(),
      driverId: driverId,
    };

    if (notes) {
      payload.notes = notes;
    }

    return this.http.post<any>(url, payload);
  }

  /**
   * Ottiene i dati di telemetria (posizione GPS) per un veicolo specifico
   */
  getVehicleTelemetry(vehicleId: number | string): Observable<{
    vehicleId: number | string;
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
