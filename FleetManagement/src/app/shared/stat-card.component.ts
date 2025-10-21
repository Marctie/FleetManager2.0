import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-stat-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div
      class="bg-white p-6 rounded-2xl shadow-xl transition-transform duration-300 hover:transform hover:-translate-y-2"
    >
      <div class="text-center">
        <h3 class="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">
          {{ title }}
        </h3>
        <p class="text-3xl font-bold text-indigo-600 mb-2">{{ value }}</p>
        <span *ngIf="label" class="text-sm text-gray-500">{{ label }}</span>
      </div>
    </div>
  `,
  styles: [],
})
export class StatCardComponent {
  @Input() title = '';
  @Input() value: string | number = '';
  @Input() label = '';
}
