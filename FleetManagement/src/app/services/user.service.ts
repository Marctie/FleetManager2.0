import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IUser } from '../models/IUser';
import { ConfigService } from './config.service';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private http = inject(HttpClient);
  private configService = inject(ConfigService);

  private get USER_ENDPOINTS() {
    const baseUrl = this.configService.getApiBaseUrl();
    return {
      list: `${baseUrl}/api/Users`,
    };
  }

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
