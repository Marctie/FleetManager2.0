import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../services/auth.service';
import { PermissionService } from '../services/permission.service';
import { Permission, UserRole, ROLE_CONFIGS } from '../models/user-roles';
import { USERS_CONFIG } from '../models/user-config';

/**
 * Componente di Debug per testare il sistema di ruoli e permessi
 * SOLO PER SVILUPPO - Rimuovere in produzione!
 *
 * Uso: Aggiungi al routing una rotta /debug
 * { path: 'debug', component: RoleDebugComponent }
 */
@Component({
  selector: 'app-role-debug',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="debug-container">
      <h1>🔧 Role & Permission Debug Panel</h1>
      <p class="warning">⚠️ SOLO PER SVILUPPO - Rimuovere in produzione!</p>

      <!-- Current User Info -->
      <section class="section">
        <h2>👤 Current User</h2>
        <div *ngIf="currentUser()" class="user-info">
          <div class="info-row">
            <span class="label">Username:</span>
            <span class="value">{{ currentUser()?.username }}</span>
          </div>
          <div class="info-row">
            <span class="label">Email:</span>
            <span class="value">{{ currentUser()?.email }}</span>
          </div>
          <div class="info-row">
            <span class="label">Role:</span>
            <span class="value role-badge" [style.background]="getRoleColor()">
              {{ currentUser()?.role }}
            </span>
          </div>
          <div class="info-row" *ngIf="currentUser()?.assignedVehicleId">
            <span class="label">Assigned Vehicle:</span>
            <span class="value">{{ currentUser()?.assignedVehicleId }}</span>
          </div>
        </div>
        <div *ngIf="!currentUser()" class="no-user">❌ No user logged in</div>
      </section>

      <!-- Quick User Switch -->
      <section class="section">
        <h2>🔄 Quick User Switch (For Testing)</h2>
        <div class="user-buttons">
          <button
            *ngFor="let user of testUsers"
            (click)="switchUser(user.username, user.role)"
            class="user-btn"
            [class.active]="currentUser()?.username === user.username"
          >
            {{ user.displayName }} ({{ user.role }})
          </button>
        </div>
        <button (click)="logout()" class="logout-btn">Logout</button>
      </section>

      <!-- Permissions Check -->
      <section class="section">
        <h2>🔐 Current User Permissions</h2>
        <div *ngIf="currentUser()" class="permissions-grid">
          <div *ngFor="let perm of allPermissions" class="permission-item">
            <span class="permission-name">{{ formatPermission(perm) }}</span>
            <span class="permission-status" [class.granted]="hasPermission(perm)">
              {{ hasPermission(perm) ? '✅' : '❌' }}
            </span>
          </div>
        </div>
      </section>

      <!-- Permission Tests -->
      <section class="section">
        <h2>🧪 Permission Tests</h2>
        <div class="tests-grid">
          <div class="test-item">
            <h3>Can Create Vehicle?</h3>
            <p class="result" [class.pass]="canCreateVehicle()">
              {{ canCreateVehicle() ? '✅ YES' : '❌ NO' }}
            </p>
          </div>
          <div class="test-item">
            <h3>Can Delete Vehicle?</h3>
            <p class="result" [class.pass]="canDeleteVehicle()">
              {{ canDeleteVehicle() ? '✅ YES' : '❌ NO' }}
            </p>
          </div>
          <div class="test-item">
            <h3>Can Manage Users?</h3>
            <p class="result" [class.pass]="canManageUsers()">
              {{ canManageUsers() ? '✅ YES' : '❌ NO' }}
            </p>
          </div>
          <div class="test-item">
            <h3>Can Upload Documents?</h3>
            <p class="result" [class.pass]="canUploadDocuments()">
              {{ canUploadDocuments() ? '✅ YES' : '❌ NO' }}
            </p>
          </div>
        </div>
      </section>

      <!-- Role Matrix -->
      <section class="section">
        <h2>📊 Role Matrix</h2>
        <div class="matrix-scroll">
          <table class="role-matrix">
            <thead>
              <tr>
                <th>Permission</th>
                <th>ADMIN</th>
                <th>MANAGER</th>
                <th>DRIVER</th>
                <th>VIEWER</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let perm of allPermissions">
                <td class="perm-name">{{ formatPermission(perm) }}</td>
                <td
                  class="matrix-cell"
                  [class.has-perm]="hasPermissionForRole(perm, 'ADMINISTRATOR')"
                >
                  {{ hasPermissionForRole(perm, 'ADMINISTRATOR') ? '✅' : '❌' }}
                </td>
                <td
                  class="matrix-cell"
                  [class.has-perm]="hasPermissionForRole(perm, 'FLEET_MANAGER')"
                >
                  {{ hasPermissionForRole(perm, 'FLEET_MANAGER') ? '✅' : '❌' }}
                </td>
                <td class="matrix-cell" [class.has-perm]="hasPermissionForRole(perm, 'DRIVER')">
                  {{ hasPermissionForRole(perm, 'DRIVER') ? '✅' : '❌' }}
                </td>
                <td class="matrix-cell" [class.has-perm]="hasPermissionForRole(perm, 'VIEWER')">
                  {{ hasPermissionForRole(perm, 'VIEWER') ? '✅' : '❌' }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <!-- LocalStorage Debug -->
      <section class="section">
        <h2>💾 LocalStorage State</h2>
        <div class="storage-info">
          <pre>{{ getLocalStorageInfo() }}</pre>
        </div>
        <button (click)="clearLocalStorage()" class="clear-btn">Clear LocalStorage</button>
      </section>
    </div>
  `,
  styles: [
    `
      .debug-container {
        padding: 2rem;
        max-width: 1400px;
        margin: 0 auto;
        background: #f8f9fa;
        min-height: 100vh;
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      }

      h1 {
        color: #2d3748;
        border-bottom: 3px solid #667eea;
        padding-bottom: 1rem;
        margin-bottom: 1rem;
      }

      .warning {
        background: #fed7d7;
        color: #742a2a;
        padding: 1rem;
        border-radius: 6px;
        margin-bottom: 2rem;
        font-weight: 600;
      }

      .section {
        background: white;
        padding: 2rem;
        border-radius: 8px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        margin-bottom: 2rem;
      }

      .section h2 {
        color: #4a5568;
        margin-bottom: 1.5rem;
        font-size: 1.5rem;
      }

      .user-info {
        display: flex;
        flex-direction: column;
        gap: 1rem;
      }

      .info-row {
        display: flex;
        gap: 1rem;
        align-items: center;
      }

      .label {
        font-weight: 600;
        color: #4a5568;
        min-width: 150px;
      }

      .value {
        color: #2d3748;
      }

      .role-badge {
        padding: 0.5rem 1rem;
        border-radius: 20px;
        color: white;
        font-weight: 600;
      }

      .no-user {
        padding: 2rem;
        text-align: center;
        color: #e53e3e;
        font-size: 1.2rem;
      }

      .user-buttons {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 1rem;
        margin-bottom: 1rem;
      }

      .user-btn {
        padding: 1rem;
        background: #667eea;
        color: white;
        border: none;
        border-radius: 6px;
        cursor: pointer;
        font-weight: 600;
        transition: all 0.3s ease;
      }

      .user-btn:hover {
        background: #5568d3;
        transform: translateY(-2px);
      }

      .user-btn.active {
        background: #22543d;
        box-shadow: 0 4px 12px rgba(34, 84, 61, 0.4);
      }

      .logout-btn {
        padding: 1rem 2rem;
        background: #e53e3e;
        color: white;
        border: none;
        border-radius: 6px;
        cursor: pointer;
        font-weight: 600;
        width: 100%;
      }

      .logout-btn:hover {
        background: #c53030;
      }

      .permissions-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
        gap: 0.5rem;
      }

      .permission-item {
        display: flex;
        justify-content: space-between;
        padding: 0.75rem;
        background: #f7fafc;
        border-radius: 6px;
      }

      .permission-name {
        color: #4a5568;
        font-size: 0.9rem;
      }

      .permission-status {
        font-size: 1.2rem;
      }

      .permission-status.granted {
        color: #38a169;
      }

      .tests-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 1.5rem;
      }

      .test-item {
        padding: 1.5rem;
        background: #f7fafc;
        border-radius: 8px;
        text-align: center;
      }

      .test-item h3 {
        color: #4a5568;
        margin-bottom: 1rem;
        font-size: 1rem;
      }

      .result {
        font-size: 1.5rem;
        font-weight: 700;
        margin: 0;
      }

      .result.pass {
        color: #38a169;
      }

      .matrix-scroll {
        overflow-x: auto;
      }

      .role-matrix {
        width: 100%;
        border-collapse: collapse;
        font-size: 0.9rem;
      }

      .role-matrix th {
        background: #4a5568;
        color: white;
        padding: 1rem;
        text-align: left;
        position: sticky;
        top: 0;
      }

      .role-matrix td {
        padding: 0.75rem;
        border-bottom: 1px solid #e2e8f0;
      }

      .perm-name {
        font-weight: 600;
        color: #4a5568;
      }

      .matrix-cell {
        text-align: center;
      }

      .matrix-cell.has-perm {
        background: #c6f6d5;
      }

      .storage-info {
        background: #2d3748;
        color: #68d391;
        padding: 1.5rem;
        border-radius: 6px;
        overflow-x: auto;
        margin-bottom: 1rem;
      }

      .storage-info pre {
        margin: 0;
        font-family: 'Courier New', monospace;
        font-size: 0.9rem;
      }

      .clear-btn {
        padding: 0.75rem 1.5rem;
        background: #f56565;
        color: white;
        border: none;
        border-radius: 6px;
        cursor: pointer;
        font-weight: 600;
      }

      .clear-btn:hover {
        background: #e53e3e;
      }
    `,
  ],
})
export class RoleDebugComponent {
  private authService = inject(AuthService);
  private permissionService = inject(PermissionService);

  currentUser = signal(this.authService.getCurrentUserInfo());
  testUsers = USERS_CONFIG;
  allPermissions = Object.values(Permission);

  switchUser(username: string, role: string) {
    // Simula login per test
    localStorage.setItem('username', username);
    localStorage.setItem('userRole', role);
    localStorage.setItem('userId', Math.floor(Math.random() * 1000).toString());
    localStorage.setItem('email', `${username}@fleetmanagement.com`);

    // Per driver, imposta un veicolo di test
    if (role === UserRole.DRIVER) {
      localStorage.setItem('assignedVehicleId', '123');
    } else {
      localStorage.removeItem('assignedVehicleId');
    }

    // Ricarica user info
    this.currentUser.set(this.authService.getCurrentUserInfo());
    alert(`Switched to ${username} (${role})\nPage will reload...`);
    location.reload();
  }

  logout() {
    localStorage.clear();
    this.currentUser.set(null);
    alert('Logged out! LocalStorage cleared.');
    location.reload();
  }

  hasPermission(permission: Permission): boolean {
    const user = this.currentUser();
    if (!user) return false;
    return this.permissionService.hasPermission(user.role, permission);
  }

  hasPermissionForRole(permission: Permission, role: string): boolean {
    return this.permissionService.hasPermission(role as UserRole, permission);
  }

  canCreateVehicle(): boolean {
    const user = this.currentUser();
    return user ? this.hasPermission(Permission.CREATE_VEHICLE) : false;
  }

  canDeleteVehicle(): boolean {
    const user = this.currentUser();
    return user ? this.permissionService.canDeleteVehicle(user) : false;
  }

  canManageUsers(): boolean {
    const user = this.currentUser();
    return user ? this.permissionService.canManageUsers(user) : false;
  }

  canUploadDocuments(): boolean {
    const user = this.currentUser();
    if (!user) return false;
    // Test con veicolo 123
    return this.permissionService.canUploadDocuments(user, 123);
  }

  formatPermission(perm: string): string {
    return perm
      .replace(/_/g, ' ')
      .toLowerCase()
      .split(' ')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

  getRoleColor(): string {
    const user = this.currentUser();
    if (!user) return '#718096';
    const config = ROLE_CONFIGS[user.role];
    return config?.color || '#718096';
  }

  getLocalStorageInfo(): string {
    const keys = ['username', 'userRole', 'userId', 'email', 'assignedVehicleId', 'authToken'];

    const info: any = {};
    keys.forEach((key) => {
      const value = localStorage.getItem(key);
      info[key] = value || '(not set)';
    });

    return JSON.stringify(info, null, 2);
  }

  clearLocalStorage() {
    if (confirm('Clear all localStorage? This will log you out.')) {
      localStorage.clear();
      alert('LocalStorage cleared!');
      location.reload();
    }
  }
}
