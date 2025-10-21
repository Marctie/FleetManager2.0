import { VehiclePosition } from './vehicle-position';

export interface IVehicle {
  id: number;
  licensePlate: string;
  model: string;
  brand: string;
  status: string;
  lastPosition?: VehiclePosition;
}

