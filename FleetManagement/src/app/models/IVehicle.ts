export interface IVehicle {
  id: number;
  licensePlate: string;
  brand: string;
  model: string;
  year: number;
  vin: string;
  fuelType: string;
  status: string;
  currentKm: 0;
  assignedDriverId: string;
  assignedDriverName: string;
  lastMaintenanceDate: Date;
  insuranceExpiryDate: Date;
  documentCount: number;
}
