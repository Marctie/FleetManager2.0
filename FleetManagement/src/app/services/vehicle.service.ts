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
  };

  /**
   Lista veicoli
   */
  getListVehicles(page: number = 1, pageSize: number = 1000): Observable<IVehicle[]> {
    return this.http.get<IVehicle[]>(
      `${this.VEHICLE_ENDPOINTS.list}?page=${page}&pageSize=${pageSize}`
    );
  }

  /**
   *Lista veicoli con id
   */
  getVehicleById(id: number): Observable<any> {
    return this.http.get(`${this.VEHICLE_ENDPOINTS.list}/${id}`);
  }
}
