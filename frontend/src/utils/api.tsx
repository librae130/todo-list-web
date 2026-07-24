import axios from "axios";

const baseURL = import.meta.env.VITE_API_BASE_URL || undefined;
export const api = axios.create({
  baseURL: baseURL,
  timeout: 5000,
});
