export interface User {
  id: number;
  username: string;
  name?: string;
  email: string;
  user_picture?: string | null;
  is_google_user?: boolean;
}