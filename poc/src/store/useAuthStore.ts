import { create } from "zustand";

interface AuthState {
  user: any;
  setAuth: (data: any) => void;
  getAccessToken: () => string | undefined;
  logout: () => void;
}

const ACCESS_TOKEN = "accessToken";
const REFRESH_TOKEN = "refreshToken";

const resolveTokenPair = (data: any) => {
  const candidates = [data, data?.data, data?.result, data?.payload];

  for (const candidate of candidates) {
    const access =
      candidate?.jwtTokens?.accessToken ??
      candidate?.tokens?.accessToken ??
      candidate?.accessToken;
    const refresh =
      candidate?.jwtTokens?.refreshToken ??
      candidate?.tokens?.refreshToken ??
      candidate?.refreshToken;

    if (access && refresh) {
      return { access, refresh };
    }
  }

  throw new Error("Access token or refresh token missing in auth response.");
};

export const useAuthStore = create<AuthState>((set) => ({
  user: null,

  setAuth: (data) => {
    const { access, refresh } = resolveTokenPair(data);

    localStorage.setItem(ACCESS_TOKEN, access);
    localStorage.setItem(REFRESH_TOKEN, refresh);

    set({ user: data });
  },

  getAccessToken: () => localStorage.getItem(ACCESS_TOKEN) ?? undefined,

  logout: () => {
    localStorage.removeItem(ACCESS_TOKEN);
    localStorage.removeItem(REFRESH_TOKEN);
    set({ user: null });
  },
}));
