import { useState } from "react";
import { LoginForm } from "../components/user-authentication/LoginForm";
import { useNavigate } from "react-router-dom";
import { apiClient } from "../utils/api";
import { getErrorMessage } from "../utils/errorUtils";

export const Login = () => {
  const navigate = useNavigate();
  
  const [error, setError] = useState<string>("");

  const loginUserAsync = async (username: string, password: string) => {
    try {
      const response = await apiClient.post("/api/users/login", {
        username,
        password,
      });

      localStorage.setItem("token", response.data.token);

      navigate("/");
    } catch (err: any) {
      setError(getErrorMessage(err));
    }
  };

  return (
    <div>
      {error && <p className="status-message status-message--error">{error}</p>}
      <LoginForm onClickLoginAsync={loginUserAsync} />
    </div>
  );
};
