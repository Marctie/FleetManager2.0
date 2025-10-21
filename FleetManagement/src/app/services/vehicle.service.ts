import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IVehicleListResponse } from '../models/IVehicleRes';

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
   * Get paginated list of vehicles
   */
  getListVehicles(page: number = 1, pageSize: number = 1000): Observable<IVehicleListResponse> {
    return this.http.get<IVehicleListResponse>(
      `${this.VEHICLE_ENDPOINTS.list}?page=${page}&pageSize=${pageSize}`
    );
  }

  /**
   * Get single vehicle by ID
   */
  getVehicleById(id: number): Observable<any> {
    return this.http.get(`${this.VEHICLE_ENDPOINTS.list}/${id}`);
  }
}
