import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-page-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="page-card" [class.clickable]="clickable">
      <ng-content></ng-content>
    </div>
  `,
  styles: [
    `
      .page-card {
        background: white;
        border-radius: 1rem;
        padding: 2rem;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        transition: all 0.3s ease;
      }

      .page-card.clickable {
        cursor: pointer;
      }

      .page-card.clickable:hover {
        transform: translateY(-5px);
        box-shadow: 0 10px 20px rgba(0, 0, 0, 0.15);
      }
    `,
  ],
})
export class PageCardComponent {
  @Input() clickable = false;
}
