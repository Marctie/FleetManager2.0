import { Component, OnInit, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MainLayoutComponent } from '../shared/main-layout.component';
import { UserService } from '../services/user.service';
import { IUser } from '../models/IUser';

@Component({
  selector: 'app-user-management',
  standalone: true,
  imports: [CommonModule, MainLayoutComponent],
  template: `
    <app-main-layout>
      <div class="page-container">
        <header class="page-header">
          <h1>User Management</h1>
          <button class="btn-back" (click)="goBack()">Back to Home</button>
        </header>

        <main class="page-content">
          <div class="actions-bar">
            <input
              type="text"
              placeholder="Search users..."
              class="search-input"
              (input)="onSearch($event)"
            />
            <!-- <button class="btn-add">Search</button> -->
            <!-- <button class="btn-add">Add User</button> -->
          </div>

          @if (error()) {
          <div class="error-message">
            {{ error() }}
          </div>
          } @if (isLoading()) {
          <div class="loading-state">Loading users...</div>
          } @else { @if (filteredUsers().length === 0) {
          <div class="empty-state">No users found.</div>
          } @else {
          <div class="users-grid">
            @for (user of filteredUsers(); track user.id) {
            <div class="user-card">
              <div class="user-avatar">
                {{ user.username.charAt(0).toUpperCase() }}
              </div>
              <div class="user-info">
                <h3>{{ user.fullName || user.username }}</h3>
                <div class="user-info" [class]="user.role.toLowerCase()">Role: {{ user.role }}</div>
                <div class="user-email">{{ user.email }}</div>
              </div>
              <div class="user-actions">
                <button class="btn-icon edit" title="Edit user">Edit</button>
              </div>
            </div>
            }
          </div>
          } }
        </main>
      </div>
    </app-main-layout>
  `,
  styles: [
    `
      .page-container {
        min-height: 100vh;
        background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
        padding: 2rem;
      }

      .page-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 2rem;
      }

      .page-header h1 {
        font-size: 2rem;
        color: #2d3748;
        font-weight: 700;
      }

      .btn-back {
        padding: 0.75rem 1.5rem;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        border: none;
        border-radius: 0.5rem;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.3s ease;
      }

      .btn-back:hover {
        transform: translateY(-2px);
        box-shadow: 0 5px 15px rgba(102, 126, 234, 0.3);
      }

      .page-content {
        max-width: 1200px;
        margin: 0 auto;
      }

      .actions-bar {
        display: flex;
        gap: 1rem;
        margin-bottom: 2rem;
      }

      .search-input {
        flex: 1;
        padding: 0.75rem 1rem;
        border: 1px solid #e2e8f0;
        border-radius: 0.5rem;
        font-size: 1rem;
      }

      .btn-add {
        padding: 0.75rem 1.5rem;
        background: #48bb78;
        color: white;
        border: none;
        border-radius: 0.5rem;
        font-weight: 600;
        cursor: pointer;
      }

      .btn-add:hover {
        background: #38a169;
      }

      .users-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
        gap: 1.5rem;
      }

      .user-card {
        background: white;
        border-radius: 1rem;
        padding: 1.5rem;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        display: flex;
        align-items: center;
        gap: 1rem;
        transition: transform 0.3s ease;
      }

      .user-card:hover {
        transform: translateY(-5px);
      }

      .user-avatar {
        width: 60px;
        height: 60px;
        border-radius: 50%;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: 700;
        font-size: 1.25rem;
      }

      .user-info {
        flex: 1;
      }

      .user-info h3 {
        font-size: 1.125rem;
        color: #2d3748;
        margin-bottom: 0.25rem;
      }

      .user-role {
        font-size: 0.875rem;
        color: #667eea;
        font-weight: 600;
        margin-bottom: 0.25rem;
      }

      .user-email {
        font-size: 0.875rem;
        color: #718096;
      }

      .user-actions {
        display: flex;
        gap: 0.5rem;
      }

      .btn-icon {
        background: none;
        border: none;
        font-size: 1.25rem;
        cursor: pointer;
        padding: 0.5rem;
        transition: transform 0.2s ease;
      }

      .btn-icon:hover {
        transform: scale(1.2);
      }

      .loading-state,
      .error-message,
      .empty-state {
        background: white;
        padding: 2rem;
        border-radius: 1rem;
        text-align: center;
        margin-top: 2rem;
      }

      .loading-state {
        color: #4a5568;
        font-size: 1.125rem;
      }

      .error-message {
        color: #e53e3e;
        background-color: #fed7d7;
      }

      .empty-state {
        color: #718096;
        font-style: italic;
      }

      .user-role {
        display: inline-block;
        padding: 0.25rem 0.75rem;
        border-radius: 1rem;
        font-size: 0.75rem;
        text-transform: uppercase;
      }

      .user-role.admin {
        background-color: #fed7d7;
        color: #e53e3e;
      }

      .user-role.manager {
        background-color: #c6f6d5;
        color: #38a169;
      }

      .user-role.driver {
        background-color: #bee3f8;
        color: #3182ce;
      }

      .user-role.viewer {
        background-color: #e9d8fd;
        color: #805ad5;
      }

      .btn-icon.edit:hover {
        color: #4299e1;
      }

      .btn-icon.active {
        color: #48bb78;
      }

      .btn-icon.inactive {
        color: #e53e3e;
      }

      @media (max-width: 768px) {
        .users-grid {
          grid-template-columns: 1fr;
        }
      }
    `,
  ],
})
export class UserManagementComponent implements OnInit {
  private router = inject(Router);
  private userService = inject(UserService);
  users = signal<IUser[]>([]);
  filteredUsers = signal<IUser[]>([]);
  isLoading = signal(false);
  error = signal<string | null>(null);
  searchTerm = signal('');

  ngOnInit(): void {
    this.loadUsers();
  }

  private loadUsers(): void {
    this.isLoading.set(true);
    this.error.set(null);

    this.userService.getUsers().subscribe({
      next: (users) => {
        this.users.set(users);
        this.filteredUsers.set(users);
        this.isLoading.set(false);
      },
      error: (error) => {
        console.error('Error loading users:', error);
        this.error.set('Error loading users. Please try again later.');
        this.isLoading.set(false);
      },
    });
  }

  onSearch(event: Event): void {
    const searchTerm = (event.target as HTMLInputElement).value.toLowerCase();
    this.searchTerm.set(searchTerm);

    const filtered = this.users().filter(
      (user) =>
        user.username.toLowerCase().includes(searchTerm) ||
        user.fullName?.toLowerCase().includes(searchTerm) ||
        user.email.toLowerCase().includes(searchTerm) ||
        user.role.toLowerCase().includes(searchTerm)
    );

    this.filteredUsers.set(filtered);
  }

  goBack() {
    this.router.navigate(['/home']);
  }
}
