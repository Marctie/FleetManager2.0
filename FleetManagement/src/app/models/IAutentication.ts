export interface IAuthResponse {
  token: string;
  refreshToken: string;
  userId: string;
  username: string;
  email: string;
  role: string;
  expiresAt: string;
}