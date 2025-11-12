import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, tap, catchError } from 'rxjs/operators';
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
  //paginazione
  getUsers(page: number = 1, pageSize: number = 1000): Observable<IUser[]> {
    console.log('[UserService] Fetching users - page:', page, 'pageSize:', pageSize);
    return this.http.get<any>(`${this.USER_ENDPOINTS.list}?page=${page}&pageSize=${pageSize}`).pipe(
      map((response: any) => {
        if (response && typeof response === 'object' && 'items' in response) {
          const users = Array.isArray(response.items) ? response.items : [];
          console.log('[UserService] Users received:', users.length, 'users');
          console.log(
            '[UserService] Roles in response:',
            users.map((u: IUser) => ({ username: u.username, role: u.role }))
          );
          return users;
        }

        if (Array.isArray(response)) {
          console.log('[UserService] Users received (array):', response.length, 'users');
          console.log(
            '[UserService] Roles in response:',
            response.map((u: IUser) => ({ username: u.username, role: u.role }))
          );
          return response;
        }

        console.warn('[UserService] Unexpected response format:', response);
        return [];
      })
    );
  }
  //utente by id
  getUserById(id: string): Observable<IUser> {
    return this.http.get<IUser>(`${this.USER_ENDPOINTS.list}/${id}`);
  }
  //creazione
  createUser(user: IUserCreateRequest): Observable<IUser> {
    console.log('[UserService] Creating user with role:', user.role, 'payload:', user);
    return this.http.post<IUser>(this.USER_ENDPOINTS.list, user).pipe(
      tap((response) => console.log('[UserService] User created successfully:', response)),
      catchError((error) => {
        console.error('[UserService] Error creating user:', error);
        throw error;
      })
    );
  }

  //aggiornamento utenti
  updateUser(id: string, user: Partial<IUser>): Observable<IUser> {
    console.log('[UserService] Updating user:', id, 'with role:', user.role, 'payload:', user);
    return this.http.put<IUser>(`${this.USER_ENDPOINTS.list}/${id}`, user).pipe(
      tap((response) => console.log('[UserService] User updated successfully:', response)),
      catchError((error) => {
        console.error('[UserService] Error updating user:', error);
        throw error;
      })
    );
  }

  //cancellazione dell'utente
  deleteUser(id: string): Observable<void> {
    return this.http.delete<void>(`${this.USER_ENDPOINTS.list}/${id}`);
  }
}
