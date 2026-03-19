import type { AxiosError, InternalAxiosRequestConfig } from "axios";
import { api } from "./axios";
import { getHeaders } from "@/shared/api/requestHeaders";

// 1. Request Interceptor: Inject headers before request is sent
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const headers = getHeaders();
    Object.entries(headers).forEach(([key, value]) => {
      config.headers.set(key, value);
    });

    return config;
  },
  (error: AxiosError) => Promise.reject(error)
);

// 2. Response Interceptor: Handle global errors
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    // If backend returns 401, the user is logged out automatically
    if (error.response?.status === 401) {
      localStorage.clear();
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);
