import { Component, Input, Output, EventEmitter } from '@angular/core';

type ButtonVariant = 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'outline';
type ButtonSize = 'sm' | 'md' | 'lg';

@Component({
  selector: 'app-button',
  standalone: true,
  imports: [],
  template: `
    <button
      [type]="type"
      [disabled]="disabled"
      (click)="onClick.emit($event)"
      [class]="getButtonClasses()"
    >
      @if (loading) {
      <span class="mr-2">Loading...</span>
      }
      <ng-content></ng-content>
    </button>
  `,
  styles: [],
})
export class ButtonComponent {
  @Input() variant: ButtonVariant = 'primary';
  @Input() size: ButtonSize = 'md';
  @Input() type: 'button' | 'submit' | 'reset' = 'button';
  @Input() disabled = false;
  @Input() loading = false;
  @Input() fullWidth = false;

  @Output() onClick = new EventEmitter<Event>();

  getButtonClasses(): string {
    const baseClasses =
      'inline-flex items-center justify-center font-semibold rounded-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed hover:transform hover:-translate-y-1 hover:shadow-lg';

    const sizeClasses = {
      sm: 'px-3 py-2 text-sm',
      md: 'px-6 py-3 text-base',
      lg: 'px-8 py-4 text-lg',
    };

    const variantClasses = {
      primary:
        'bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:shadow-indigo-500/30 focus:ring-indigo-500',
      secondary: 'bg-gray-200 text-gray-800 hover:bg-gray-300 focus:ring-gray-500',
      success:
        'bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:shadow-green-500/30 focus:ring-green-500',
      danger:
        'bg-gradient-to-r from-red-500 to-pink-600 text-white hover:shadow-red-500/30 focus:ring-red-500',
      warning:
        'bg-gradient-to-r from-yellow-500 to-orange-600 text-white hover:shadow-yellow-500/30 focus:ring-yellow-500',
      outline:
        'border-2 border-indigo-500 text-indigo-500 bg-transparent hover:bg-indigo-50 focus:ring-indigo-500',
    };

    const widthClass = this.fullWidth ? 'w-full' : '';

    return `${baseClasses} ${sizeClasses[this.size]} ${
      variantClasses[this.variant]
    } ${widthClass}`.trim();
  }
}
