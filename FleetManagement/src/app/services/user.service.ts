import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { IUser, IUserCreateRequest } from '../models/IUser';
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
    return this.http.get<any>(`${this.USER_ENDPOINTS.list}?page=${page}&pageSize=${pageSize}`).pipe(
      map((response: any) => {
        console.log('[UserService] Raw API response:', response);

        // Se l'API restituisce un formato paginato con 'items'
        if (response && typeof response === 'object' && 'items' in response) {
          console.log('[UserService] Detected paginated response, returning items array');
          return Array.isArray(response.items) ? response.items : [];
        }

        // Se l'API restituisce direttamente un array
        if (Array.isArray(response)) {
          console.log('[UserService] Detected direct array response');
          return response;
        }

        // Fallback per risposte inaspettate
        console.error('[UserService] Unexpected API response format:', response);
        return [];
      })
    );
  }

  /**
   * Get user by ID
   */
  getUserById(id: string): Observable<IUser> {
    return this.http.get<IUser>(`${this.USER_ENDPOINTS.list}/${id}`);
  }

  /**
   * Create a new user
   */
  createUser(user: IUserCreateRequest): Observable<IUser> {
    return this.http.post<IUser>(this.USER_ENDPOINTS.list, user);
  }

  /**
   * Update an existing user
   */
  updateUser(id: string, user: Partial<IUser>): Observable<IUser> {
    return this.http.put<IUser>(`${this.USER_ENDPOINTS.list}/${id}`, user);
  }

  /**
   * Delete a user
   */
  deleteUser(id: string): Observable<void> {
    return this.http.delete<void>(`${this.USER_ENDPOINTS.list}/${id}`);
  }
}
