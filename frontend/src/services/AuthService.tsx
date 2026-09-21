import { apiClient } from "../utils/apiClient";

export class AuthService {
  public static async login(username: string, password: string): Promise<void> {
    await apiClient.post("/api/auth/login", { username, password });
  }

  public static async register(username: string, password: string): Promise<void> {
    await apiClient.post("/api/auth/register", { username, password });
  }

  public static async logout(): Promise<void> {
    await apiClient.get("/api/auth/logout");
  }
}
