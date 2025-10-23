import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-stat-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="stat-card">
      <div class="stat-content">
        <h3>{{ title }}</h3>
        <p class="stat-value">{{ value }}</p>
        @if (label) {
        <span class="stat-label">{{ label }}</span>
        }
      </div>
    </div>
  `,
  styles: [
    `
      .stat-card {
        background: white;
        padding: 1.5rem;
        border-radius: 1rem;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        transition: transform 0.3s ease;
      }

      .stat-card:hover {
        transform: translateY(-5px);
      }

      .stat-content h3 {
        font-size: 0.875rem;
        color: #718096;
        margin-bottom: 0.5rem;
      }

      .stat-value {
        font-size: 2rem;
        font-weight: 700;
        color: #667eea;
        margin: 0.5rem 0;
      }

      .stat-label {
        font-size: 0.875rem;
        color: #718096;
        text-align: center;
      }
    `,
  ],
})
export class StatCardComponent {
  @Input() title = '';
  @Input() value: string | number = '';
  @Input() label = '';
}
