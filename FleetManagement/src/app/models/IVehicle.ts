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
  vehicleId: number;
  lastPosition: {
    latitude: number;
    longitude: number;
    speed: number;
    heading: number;
    timestamp: Date | string | number;
  };
  time?: Date | string | number;
}

export interface IVehicleRes {
  items: IVehicle[];
  total: number;
  page: number;
  pageSize: number;
}
