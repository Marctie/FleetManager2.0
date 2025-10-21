export interface IVehiclePosition {
  vehicleId: number;
  latitude: number;
  longitude: number;
  speed: number;
  heading: number;
  timestamp: Date | string | number;
  time?: Date | string | number;
}
