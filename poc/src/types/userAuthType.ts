export interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  user: any;
  setAuth: (data: any) => void;
  logout: () => void;
}