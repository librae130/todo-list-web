import { useState } from "react";
import { LoginForm } from "../components/user-authentication/LoginForm";
import { useNavigate } from "react-router-dom";
import { apiClient } from "../utils/apiClient";

export const Login = () => {
  const navigate = useNavigate();

  const [error, setError] = useState<string>("");

  const loginUserAsync = async (username: string, password: string) => {
    try {
      await apiClient.post("/api/auth/login", {
        username,
        password,
      });

      navigate("/");
    } catch (error: any) {
      setError("Incorrect");
    }
  };

  return (
    <div>
      {error && <p className="status-message status-message--error">{error}</p>}
      <LoginForm onClickLoginAsync={loginUserAsync} />
    </div>
  );
};
