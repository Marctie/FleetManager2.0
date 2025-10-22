import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-management',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="page-container">
      <header class="page-header">
        <h1>User Management</h1>
        <button class="btn-back" (click)="goBack()">Back to Home</button>
      </header>

      <main class="page-content">
        <div class="actions-bar">
          <input type="text" placeholder="Search users..." class="search-input" />
          <button class="btn-add">Add User</button>
        </div>

        <div class="users-grid"></div>
      </main>
    </div>
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

      @media (max-width: 768px) {
        .users-grid {
          grid-template-columns: 1fr;
        }
      }
    `,
  ],
})
export class UserManagementComponent {
  users = [];

  constructor(private router: Router) {}

  goBack() {
    this.router.navigate(['/home']);
  }
}
