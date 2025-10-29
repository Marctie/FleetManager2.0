import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IUser } from '../models/IUser';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private http = inject(HttpClient);

  private readonly API_BASE_URL = 'http://10.0.90.9/Stage/FleetManagement';
  private readonly USER_ENDPOINTS = {
    list: `${this.API_BASE_URL}/api/Users`,
  };

  /**
   * Get paginated list of users
   */
  getUsers(page: number = 1, pageSize: number = 1000): Observable<IUser[]> {
    return this.http.get<IUser[]>(`${this.USER_ENDPOINTS.list}?page=${page}&pageSize=${pageSize}`);
  }

  /**
   * Get user by ID
   */
  getUserById(id: string): Observable<IUser> {
    return this.http.get<IUser>(`${this.USER_ENDPOINTS.list}/${id}`);
  }
}
