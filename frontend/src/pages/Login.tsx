import { useState } from "react";
import { LoginForm } from "../components/authentication-forms/LoginForm";
import { useNavigate } from "react-router-dom";
import { AuthService } from "../services/AuthService";

export const Login = () => {
  const navigate = useNavigate();

  const [error, setError] = useState<string>("");

  const loginUserAsync = async (username: string, password: string) => {
    try {
      await AuthService.login(username, password);

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
