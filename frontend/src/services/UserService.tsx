import type { UserDto } from "../dtos/UserDto";
import { apiClient } from "../utils/apiClient";

export class UserService {
  public static async getCurrentUser(signal?: AbortSignal): Promise<UserDto> {
    const response = await apiClient.get<UserDto>("/api/users/me", { signal });
    return response.data;
  }
}
