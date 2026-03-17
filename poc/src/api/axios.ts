import axios from "axios";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL, // "/"
});

api.interceptors.request.use((config) => {
  console.log("REQUEST:", config.url, config);
  return config;
});

api.interceptors.response.use(
  (res) => {
    console.log("RESPONSE:", res.data);
    return res;
  },
  (err) => {
    console.error("ERROR:", err.response?.data);
    return Promise.reject(err);
  }
);