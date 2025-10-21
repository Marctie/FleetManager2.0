import { IVehiclePosition } from './IVehiclePosition';

export interface IVehicle {
  id: number;
  licensePlate: string;
  model: string;
  brand: string;
  status: string;
  lastPosition?: IVehiclePosition;
}
