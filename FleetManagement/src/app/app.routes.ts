import { Routes } from '@angular/router';
import { LoginComponent } from './login';
import { HomeComponent } from './features/home';
import { authGuard, guestGuard } from './features/auth/auth-guard';
import { DashboardComponent } from './features/vehicles/dashboard';
import { VehicleListComponent } from './features/vehicles/vehicle-list.component';
import { VehicleDetailComponent } from './features/vehicles/vehicle-detail.component';
import { GeneralMapComponent } from './features/vehicles/general-map';
import { VehicleFormComponent } from './features/vehicles/vehicle-form.component';
import { UserManagementComponent } from './features/user-management.component';
import { AssociationsComponent } from './features/associations.component';
import { ReportsComponent } from './features/reports';
import { DocumentsComponent } from './features/documents';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  {
    path: 'login',
    component: LoginComponent,
    canActivate: [guestGuard],
  },
  {
    path: 'home',
    component: HomeComponent,
    canActivate: [authGuard],
  },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [authGuard],
  },
  {
    path: 'vehicle-list',
    component: VehicleListComponent,
    canActivate: [authGuard],
  },
  {
    path: 'vehicle-detail',
    component: VehicleDetailComponent,
    canActivate: [authGuard],
  },
  {
    path: 'general-map',
    component: GeneralMapComponent,
    canActivate: [authGuard],
  },
  {
    path: 'vehicle-form',
    component: VehicleFormComponent,
    canActivate: [authGuard],
  },
  {
    path: 'user-management',
    component: UserManagementComponent,
    canActivate: [authGuard],
  },
  {
    path: 'associations',
    component: AssociationsComponent,
    canActivate: [authGuard],
  },
  {
    path: 'reports',
    component: ReportsComponent,
    canActivate: [authGuard],
  },
  {
    path: 'documents',
    component: DocumentsComponent,
    canActivate: [authGuard],
  },
];
