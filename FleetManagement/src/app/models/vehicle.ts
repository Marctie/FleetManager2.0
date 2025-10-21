import { VehiclePosition } from './vehicle-position';

export interface Vehicle {
  id: number;
  licensePlate: string;
  model: string;
  brand: string;
  status: string;
  lastPosition?: VehiclePosition;
}

export interface VehicleListResponse {
  items: Vehicle[];
  total: number;
  page: number;
  pageSize: number;
}
