import axios from "axios";

const baseURL = import.meta.env.VITE_API_BASE_URL || undefined;

export const apiClient = axios.create({
  baseURL: baseURL,
  timeout: 5000,
});

apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);
