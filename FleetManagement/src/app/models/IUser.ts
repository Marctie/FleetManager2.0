export interface IUser {
  id: string;
  username: string;
  email: string;
  role: string;
  fullName?: string;
  isActive: boolean;
  lastLogin?: Date;
}

export interface IUserCreateRequest {
  username: string;
  email: string;
  password: string;
  role: number; // promemoria: 0=Admin, 1=Manager, 2=Driver, 3=Viewer
}

export interface IUserResponse {
  items: IUser[];
  total: number;
  page: number;
  pageSize: number;
}
