import { Component, inject, signal, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MainLayoutComponent } from '../../shared/main-layout.component';
import { VehicleDetailComponent } from './vehicle-detail.component';
import { VehicleService } from '../../services/vehicle.service';
import { IVehicle } from '../../models/IVehicle';
import { FormsModule } from '@angular/forms';
import { RoleService } from '../../services/role.service';

@Component({
  selector: 'app-vehicle-list',
  standalone: true,
  imports: [MainLayoutComponent, VehicleDetailComponent, FormsModule],
  template: `
    <app-main-layout>
      <div class="page-container">
        <header class="page-header">
          <h1>Vehicle List</h1>
          <div>
            <button class="btn-add" style="margin: 0px 5px" (click)="goVehicleMap()">
              Vehicle Map
            </button>
            @if (roleService.canCreateVehicles()) {
            <button class="btn-add" style="margin: 0px 5px" (click)="goVehicleForm()">
              Vehicle Form
            </button>
            }
            <button class="btn-back" style="margin: 0px 5px" (click)="goBack()">
              Back to Home
            </button>
          </div>
        </header>

        <main class="page-content">
          <div class="filter-section">
            <input
              type="text"
              placeholder="Search vehicles..."
              class="search-input"
              [(ngModel)]="searchQuery"
              (ngModelChange)="searchVehicles()"
              name="search"
            />
            <div class="select-wrap">
              <select
                class="filter-select"
                [(ngModel)]="selectedFilterType"
                name="filterType"
                (ngModelChange)="onFilterTypeChange()"
              >
                <option value="">All Fields</option>
                <option value="status">Status</option>
                <option value="model">Model</option>
              </select>
            </div>
            <button class="btn-add" (click)="searchVehicles()">Search Vehicle</button>
            <button class="btn-reset" (click)="resetFilters()">Reset Filters</button>
          </div>

          @if (error()) {
          <div class="error-message">
            {{ error() }}
          </div>
          } @else if (isLoading()) {
          <div class="loading-state">Loading vehicles...</div>
          } @else {
          <div class="vehicle-table">
            <table>
              <thead>
                <tr>
                  <!-- <th>ID</th> -->
                  <th>Model</th>
                  <th>Plate</th>
                  <th>Status</th>
                  <th>Driver</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                @for (vehicle of vehicles(); track vehicle.id) {
                <tr>
                  <!-- <td>{{ vehicle.id }}</td> -->
                  <td>{{ vehicle.model }}</td>
                  <td>{{ vehicle.licensePlate }}</td>
                  <td>
                    <span class="status-badge" [class]="vehicle.status.toLowerCase()">
                      {{ vehicle.status }}
                    </span>
                  </td>
                  <td>{{ vehicle.assignedDriverName || 'N/A' }}</td>
                  <td>
                    <button class="btn-action" (click)="openModal(vehicle)">View</button>
                    <!-- <button class="btn-action">Edit</button> -->
                  </td>
                </tr>
                }
              </tbody>
            </table>
          </div>
          }

          <!-- Paginazione -->
          @if (!isLoading() && !error() && totalPages() > 1) {
          <div class="pagination-container">
            <div class="pagination-info">
              Showing {{ (currentPage() - 1) * pageSize() + 1 }} to
              {{ Math.min(currentPage() * pageSize(), totalItems()) }}
              of {{ totalItems() }} vehicles
            </div>

            <div class="pagination-controls">
              <button class="btn-page" (click)="previousPage()" [disabled]="currentPage() === 1">
                ← Previous
              </button>

              @for (pageNum of getPageNumbers(); track pageNum) {
              <button
                class="btn-page"
                [class.active]="pageNum === currentPage()"
                (click)="goToPage(pageNum)"
              >
                {{ pageNum }}
              </button>
              }

              <button
                class="btn-page"
                (click)="nextPage()"
                [disabled]="currentPage() === totalPages()"
              >
                Next →
              </button>
            </div>

            <div class="page-size-selector">
              <label>Items per page:</label>
              <select
                [(ngModel)]="pageSize"
                (ngModelChange)="changePageSize($event)"
                name="pageSize"
              >
                <option [value]="10">10</option>
                <option [value]="20">20</option>
                <option [value]="50">50</option>
                <option [value]="100">100</option>
              </select>
            </div>
          </div>
          } @if (showModal() && selectedVehicle()) {
          <app-vehicle-detail
            [vehicle]="selectedVehicle()!"
            (closeModal)="handleCloseModal($event)"
            (vehicleUpdated)="handleVehicleUpdated($event)"
          >
          </app-vehicle-detail>
          }
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
        max-width: 1400px;
        margin: 0 auto;
      }

      .filter-section {
        display: flex;
        gap: 1rem;
        margin-bottom: 1.5rem;
      }

      .filter-select {
        width: 100%;
        padding: 14px 18px;
        padding-right: 44px;
        border-radius: 10px;
        border: 2px solid #dee2e6;
        background: #fff;
        font-size: clamp(0.875rem, 2.5vw, 1rem);
        cursor: pointer;
        font-family: 'Inter', 'Segoe UI', 'SF Pro Display', -apple-system, BlinkMacSystemFont,
          sans-serif;
        font-weight: 400;
        color: #333;
        outline: none;
        transition: all 0.3s ease;
        appearance: none;
        -webkit-appearance: none;
        -moz-appearance: none;
        background-image: url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='%23007bff' viewBox='0 0 16 16'%3E%3Cpath d='M8 11.5l-4-4h8l-4 4z'/%3E%3C/svg%3E");
        background-repeat: no-repeat;
        background-position: right 16px center;
        background-size: 16px;
        box-sizing: border-box;
      }

      .filter-select:focus {
        border-color: #007bff;
        box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.1);
      }

      .filter-select:hover {
        border-color: #007bff;
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
        transition: all 0.3s ease;
      }

      .btn-add:hover {
        background: #38a169;
      }

      .btn-reset {
        padding: 0.75rem 1.5rem;
        background: #e53e3e;
        color: white;
        border: none;
        border-radius: 0.5rem;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.3s ease;
      }

      .btn-reset:hover {
        background: #c53030;
      }

      .vehicle-table {
        background: white;
        border-radius: 1rem;
        overflow: hidden;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      }

      table {
        width: 100%;
        border-collapse: collapse;
      }

      thead {
        background: #f7fafc;
      }

      th {
        padding: 1rem;
        text-align: left;
        font-weight: 600;
        color: #2d3748;
        border-bottom: 2px solid #e2e8f0;
      }

      td {
        padding: 1rem;
        border-bottom: 1px solid #e2e8f0;
        color: #4a5568;
      }

      tbody tr:hover {
        background: #f7fafc;
      }

      .status-badge {
        padding: 0.25rem 0.75rem;
        border-radius: 1rem;
        font-size: 0.875rem;
        font-weight: 600;
      }

      .status-badge.active {
        background: #c6f6d5;
        color: #22543d;
      }

      .status-badge.maintenance {
        background: #fed7d7;
        color: #742a2a;
      }

      .status-badge.parked {
        background: #bee3f8;
        color: #2c5282;
      }

      .btn-action {
        padding: 0.5rem 1rem;
        margin-right: 0.5rem;
        background: #667eea;
        color: white;
        border: none;
        border-radius: 0.25rem;
        cursor: pointer;
        font-size: 0.875rem;
      }

      .btn-action:hover {
        background: #5a67d8;
      }

      .loading-state {
        text-align: center;
        padding: 2rem;
        background: white;
        border-radius: 1rem;
        font-size: 1.125rem;
        color: #4a5568;
      }

      .error-message {
        padding: 1rem;
        margin-bottom: 1rem;
        background: #fed7d7;
        color: #742a2a;
        border-radius: 0.5rem;
        font-weight: 500;
      }

      /* Paginazione */
      .pagination-container {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-top: 1.5rem;
        padding: 1rem;
        background: white;
        border-radius: 0.5rem;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        flex-wrap: wrap;
        gap: 1rem;
      }

      .pagination-info {
        color: #4a5568;
        font-size: 0.875rem;
        font-weight: 500;
      }

      .pagination-controls {
        display: flex;
        gap: 0.5rem;
        align-items: center;
      }

      .btn-page {
        padding: 0.5rem 0.75rem;
        background: white;
        color: #667eea;
        border: 1px solid #e2e8f0;
        border-radius: 0.375rem;
        cursor: pointer;
        font-weight: 500;
        font-size: 0.875rem;
        transition: all 0.2s ease;
        min-width: 40px;
      }

      .btn-page:hover:not(:disabled) {
        background: #f7fafc;
        border-color: #667eea;
      }

      .btn-page.active {
        background: #667eea;
        color: white;
        border-color: #667eea;
      }

      .btn-page:disabled {
        opacity: 0.5;
        cursor: not-allowed;
        color: #a0aec0;
      }

      .page-size-selector {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        font-size: 0.875rem;
        color: #4a5568;
      }

      .page-size-selector label {
        font-weight: 500;
      }

      .page-size-selector select {
        padding: 0.5rem;
        border: 1px solid #e2e8f0;
        border-radius: 0.375rem;
        background: white;
        cursor: pointer;
        font-size: 0.875rem;
      }

      .page-size-selector select:focus {
        outline: none;
        border-color: #667eea;
        box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
      }

      @media (max-width: 1024px) {
        .page-container {
          padding: 1rem;
        }

        .page-header {
          flex-direction: column;
          gap: 1rem;
          align-items: stretch;
          text-align: center;
        }

        .page-header > div {
          display: flex;
          gap: 0.5rem;
          justify-content: center;
          flex-wrap: wrap;
        }

        .btn-add,
        .btn-back {
          width: 100%;
          margin: 0 !important;
        }
      }

      @media (max-width: 768px) {
        .filter-section {
          flex-direction: column;
          gap: 0.75rem;
        }

        .vehicle-table {
          overflow-x: auto;
        }

        table {
          font-size: 0.875rem;
          min-width: 600px;
        }

        th,
        td {
          padding: 0.75rem 0.5rem;
        }

        .status-badge {
          padding: 0.15rem 0.5rem;
          font-size: 0.75rem;
        }

        .btn-action {
          padding: 0.35rem 0.75rem;
          font-size: 0.75rem;
        }

        .pagination-container {
          flex-direction: column;
          align-items: stretch;
          gap: 1rem;
        }

        .pagination-info,
        .page-size-selector {
          text-align: center;
          justify-content: center;
        }

        .pagination-controls {
          justify-content: center;
          flex-wrap: wrap;
        }

        .btn-page {
          padding: 0.4rem 0.6rem;
          font-size: 0.75rem;
          min-width: 35px;
        }
      }

      @media (max-width: 480px) {
        .page-container {
          padding: 0.75rem;
        }

        .page-header h1 {
          font-size: 1.5rem;
        }

        .btn-add,
        .btn-back,
        .btn-reset {
          width: 100%;
          font-size: 0.875rem;
          padding: 0.6rem 1rem;
        }

        .search-input {
          padding: 0.6rem 0.75rem;
          font-size: 16px; /* Previene lo zoom su iOS */
        }

        .filter-select {
          padding: 0.6rem 0.75rem;
          font-size: 0.875rem;
        }

        table {
          font-size: 0.8rem;
          min-width: 550px;
        }

        th,
        td {
          padding: 0.6rem 0.4rem;
        }

        .btn-action {
          padding: 0.3rem 0.6rem;
          font-size: 0.7rem;
          margin-right: 0.25rem;
        }

        .status-badge {
          padding: 0.1rem 0.4rem;
          font-size: 0.7rem;
        }
      }

      @media (max-width: 360px) {
        .page-header h1 {
          font-size: 1.25rem;
        }

        .btn-add,
        .btn-back,
        .btn-reset {
          font-size: 0.8rem;
          padding: 0.5rem 0.75rem;
        }

        table {
          font-size: 0.75rem;
          min-width: 500px;
        }

        th,
        td {
          padding: 0.5rem 0.3rem;
        }

        .loading-state,
        .error-state,
        .no-vehicles {
          font-size: 0.875rem;
          padding: 1.5rem;
        }
      }
    `,
  ],
})
export class VehicleListComponent implements OnInit {
  showModal = signal(false);
  isLoading = signal(false);
  error = signal<string | null>(null);
  vehicles = signal<IVehicle[]>([]);
  selectedVehicle = signal<IVehicle | null>(null);
  availableModels = signal<string[]>([]);

  // Proprietà per i filtri di ricerca
  searchQuery = '';
  selectedFilterType = '';

  // Proprietà per la paginazione
  currentPage = signal(1);
  pageSize = signal(20);
  totalItems = signal(0);
  totalPages = signal(0);

  // timer per la ricerca automatica (debounce)
  private searchTimeout: any;

  router = inject(Router);
  vehicleService = inject(VehicleService);
  roleService = inject(RoleService);

  // Espone Math per il template
  Math = Math;

  ngOnInit(): void {
    this.loadVehicles();
  }

  // Caricamento dei veicoli con filtri opzionali e paginazione
  private loadVehicles(filters?: { search?: string; status?: string; model?: string }): void {
    this.isLoading.set(true);
    this.error.set(null);

    // Costruisci le opzioni per la chiamata API
    const options: any = {
      page: this.currentPage(),
      pageSize: this.pageSize(),
    };

    // Aggiungi i filtri se presenti
    if (filters?.search) {
      options.search = filters.search;
    }
    if (filters?.status) {
      options.status = filters.status;
    }
    if (filters?.model) {
      options.model = filters.model;
    }

    // Chiamata API con i parametri di ricerca e paginazione
    this.vehicleService.getListVehicles(options).subscribe({
      next: (response) => {
        // Verifica se la risposta ha la struttura corretta
        if (!response || !response.items) {
          console.error('Invalid API response format:', response);
          this.error.set('Invalid data format received from server.');
          this.isLoading.set(false);
          return;
        }

        // Imposta i veicoli dalla risposta paginata
        this.vehicles.set(response.items);

        // Aggiorna i dati di paginazione
        this.totalItems.set(response.total || 0);
        this.currentPage.set(response.page || 1);
        this.pageSize.set(response.pageSize || 20);
        this.totalPages.set(Math.ceil((response.total || 0) / (response.pageSize || 20)));

        // Estrai i modelli unici per il filtro dropdown
        if (response.items.length > 0) {
          const uniqueModels = [...new Set(response.items.map((v: IVehicle) => v.model))].sort();
          this.availableModels.set(uniqueModels);
        }

        this.isLoading.set(false);
      },
      error: (error) => {
        console.error('Error loading vehicles:', error);
        this.error.set('Error loading vehicles. Please try again later.');
        this.isLoading.set(false);
      },
    });
  }

  // Cambio del tipo di filtro
  onFilterTypeChange(): void {
    this.searchQuery = ''; // Reset della query
    this.searchVehicles(); // Ricarica i dati
  }

  // Ricerca veicoli tramite API (con debounce)
  searchVehicles(): void {
    // Cancella il timer precedente se esiste
    if (this.searchTimeout) {
      clearTimeout(this.searchTimeout);
    }

    // Imposta un nuovo timer per evitare troppe chiamate API
    this.searchTimeout = setTimeout(() => {
      const query = this.searchQuery.trim();

      // Costruisci l'oggetto filtri in base al tipo selezionato
      const filters: { search?: string; status?: string; model?: string } = {};

      if (query) {
        switch (this.selectedFilterType) {
          case 'status':
            filters.status = query;
            break;
          case 'model':
            filters.model = query;
            break;
          default:
            // Ricerca generale (il backend cerca in tutti i campi)
            filters.search = query;
            break;
        }
      }

      // Ricarica i veicoli con i filtri applicati
      this.loadVehicles(filters);
    }, 300); // Attende 300ms dopo l'ultimo input prima di chiamare l'API
  }

  // Reset dei filtri e ricarica tutti i veicoli
  resetFilters(): void {
    this.searchQuery = '';
    this.selectedFilterType = '';
    this.currentPage.set(1); // Reset alla prima pagina
    this.loadVehicles(); // Ricarica senza filtri
  }

  // Metodi per la paginazione
  goToPage(page: number): void {
    if (page < 1 || page > this.totalPages()) return;
    this.currentPage.set(page);

    // Ricarica con gli stessi filtri
    const filters: { search?: string; status?: string; model?: string } = {};
    const query = this.searchQuery.trim();

    if (query) {
      switch (this.selectedFilterType) {
        case 'status':
          filters.status = query;
          break;
        case 'model':
          filters.model = query;
          break;
        default:
          filters.search = query;
          break;
      }
    }

    this.loadVehicles(filters);
  }

  nextPage(): void {
    if (this.currentPage() < this.totalPages()) {
      this.goToPage(this.currentPage() + 1);
    }
  }

  previousPage(): void {
    if (this.currentPage() > 1) {
      this.goToPage(this.currentPage() - 1);
    }
  }

  changePageSize(newPageSize: number): void {
    this.pageSize.set(newPageSize);
    this.currentPage.set(1); // Reset alla prima pagina
    this.searchVehicles(); // Ricarica con la nuova dimensione
  }

  // Genera array di numeri per la paginazione
  getPageNumbers(): number[] {
    const total = this.totalPages();
    const current = this.currentPage();
    const pages: number[] = [];

    // Mostra max 7 pagine
    let start = Math.max(1, current - 3);
    let end = Math.min(total, start + 6);

    // Aggiusta se siamo vicini alla fine
    if (end - start < 6) {
      start = Math.max(1, end - 6);
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    return pages;
  }

  openModal(vehicle: IVehicle) {
    this.selectedVehicle.set(vehicle);
    this.showModal.set(true);
  }

  handleCloseModal(event: boolean) {
    if (event) {
      this.showModal.set(false);
      this.selectedVehicle.set(null);
    }
  }

  handleVehicleUpdated(updatedVehicle: IVehicle) {
    // Aggiorna il veicolo nella lista locale
    const currentVehicles = this.vehicles();
    const vehicleIndex = currentVehicles.findIndex((v) => v.id === updatedVehicle.id);

    if (vehicleIndex !== -1) {
      // Aggiorna il veicolo nella lista
      const updatedVehicles = [...currentVehicles];
      updatedVehicles[vehicleIndex] = updatedVehicle;
      this.vehicles.set(updatedVehicles);

      // Aggiorna anche il selectedVehicle se è lo stesso
      if (this.selectedVehicle()?.id === updatedVehicle.id) {
        this.selectedVehicle.set(updatedVehicle);
      }
    } else {
      // Se il veicolo non è nella lista (es. è stato eliminato), ricarica la lista
      this.reloadCurrentPage();
    }
  }

  // Metodo per ricaricare la pagina corrente mantenendo i filtri
  private reloadCurrentPage(): void {
    const filters: { search?: string; status?: string; model?: string } = {};
    const query = this.searchQuery.trim();

    if (query) {
      switch (this.selectedFilterType) {
        case 'status':
          filters.status = query;
          break;
        case 'model':
          filters.model = query;
          break;
        default:
          filters.search = query;
          break;
      }
    }

    this.loadVehicles(filters);
  }

  //funzioni di  navigazione
  goVehicleMap() {
    this.router.navigate(['/general-map']);
  }
  goVehicleForm() {
    this.router.navigate(['/vehicle-form']);
  }
  goBack() {
    this.router.navigate(['/home']);
  }
}
