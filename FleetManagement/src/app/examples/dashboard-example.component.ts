import { Component } from '@angular/core';
import { StatCardComponent } from '../shared/stat-card.component';
import { PageCardComponent } from '../shared/page-card.component';

@Component({
  selector: 'app-dashboard-example',
  standalone: true,
  imports: [StatCardComponent, PageCardComponent],
  template: `
    <div class="p-8 space-y-8">
      <!-- Esempio StatCard - FUNZIONA ANCORA! -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <app-stat-card title="Veicoli Totali" value="24" label="In flotta"></app-stat-card>
        <app-stat-card title="Attivi" value="18" label="In servizio"></app-stat-card>
        <app-stat-card title="Manutenzione" value="6" label="In officina"></app-stat-card>
      </div>

      <!-- Esempio PageCard - FUNZIONA ANCORA! -->
      <app-page-card [clickable]="true">
        <h3 class="text-xl font-bold mb-4">Dashboard Overview</h3>
        <p class="text-gray-600">
          Le card sono ancora tutte presenti e funzionanti, ma ora utilizzano Tailwind CSS per uno
          stile più moderno e performante!
        </p>
      </app-page-card>
    </div>
  `,
})
export class DashboardExampleComponent {}
