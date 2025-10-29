export interface IUser {
  id: string;
  username: string;
  email: string;
  role: string;
  fullName?: string;
  isActive: boolean;
  lastLogin?: Date;
}

export interface IUserResponse {
  items: IUser[];
  total: number;
  page: number;
  pageSize: number;
}
