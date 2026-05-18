export interface LoginResponse {
  id: number;
  username: string;
  email: string;
  token: string;
  user_picture?: string | null;
  error?: string;
}