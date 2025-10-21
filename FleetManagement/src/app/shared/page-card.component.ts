import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-page-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div
      class="bg-white rounded-2xl p-8 shadow-xl transition-all duration-300"
      [class.cursor-pointer]="clickable"
      [class.hover:transform]="clickable"
      [class.hover:-translate-y-2]="clickable"
      [class.hover:shadow-2xl]="clickable"
    >
      <ng-content></ng-content>
    </div>
  `,
  styles: [],
})
export class PageCardComponent {
  @Input() clickable = false;
}
