import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { UserService } from "../services/UserService.tsx";
import { AuthService } from "../services/AuthService.tsx";
import type { UserDto } from "../dtos/UserDto.tsx";
import { getErrorMessage } from "../utils/errorUtils.tsx";
import { useNavigate } from "react-router-dom";

export const useUser = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<UserDto | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const abortController = new AbortController();

    const fetchUser = async () => {
      setIsLoading(true);

      try {
        const currentUser = await UserService.getCurrentUser(abortController.signal);
        setUser(currentUser);
      } catch (error) {
        if (axios.isCancel(error)) return;

        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();

    return () => abortController.abort();
  }, []);

  const register = useCallback(
    async (username: string, password: string) => {
      try {
        await AuthService.register(username, password);

        navigate("/login");
      } catch (error: any) {
        setError(getErrorMessage(error));
      }
    },
    [navigate],
  );

  const login = useCallback(
    async (username: string, password: string) => {
      try {
        await AuthService.login(username, password);

        navigate("/");
      } catch (error: any) {
        setError(getErrorMessage(error));
      }
    },
    [navigate],
  );

  const logout = useCallback(async () => {
    setIsLoading(true);

    try {
      await AuthService.logout();
      setUser(null);
      setError("");
    } catch (error) {
      setError(getErrorMessage(error));
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { user, isLoading, error, register, login, logout };
};
