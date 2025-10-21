import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-page-header',
  standalone: true,
  imports: [CommonModule],
  template: `
    <header
      class="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4 md:gap-0"
    >
      <h1 class="text-3xl font-bold text-gray-800">{{ title }}</h1>
      <button
        (click)="onBack.emit()"
        class="px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold rounded-lg 
               transition-all duration-300 hover:transform hover:-translate-y-1 hover:shadow-lg hover:shadow-indigo-500/30"
      >
        Back to Home
      </button>
    </header>
  `,
  styles: [],
})
export class PageHeaderComponent {
  @Input() title = '';
  @Output() onBack = new EventEmitter<void>();
}
