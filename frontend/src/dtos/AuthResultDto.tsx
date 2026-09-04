import { type UserDto } from "./UserDto";

export interface AuthResultDto {
  accessToken: string;
  refreshToken: string;
  user: UserDto;
}
