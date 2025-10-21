import { IVehicle } from "./IVehicle";

export interface IVehicleListResponse {
  items: IVehicle[];
  total: number;
  page: number;
  pageSize: number;
}
