import axios from "axios";
import { getJwtToken } from "./JwtUtils";

const baseURL = import.meta.env.VITE_API_BASE_URL || undefined;

export const apiClient = axios.create({
  baseURL: baseURL,
  timeout: 5000,
});

apiClient.interceptors.request.use(
  (config) => {
    const token = getJwtToken();
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);
