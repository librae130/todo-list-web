import { useState } from "react";
import { LoginForm } from "../components/authentication-forms/LoginForm";
import { useNavigate } from "react-router-dom";
import { AuthService } from "../services/AuthService";
import { getErrorMessage } from "../utils/errorUtils";

export const Login = () => {
  const navigate = useNavigate();

  const [error, setError] = useState<string>("");

  const loginUserAsync = async (username: string, password: string) => {
    try {
      await AuthService.login(username, password);

      navigate("/");
    } catch (error: any) {
      setError(getErrorMessage(error));
    }
  };

  return (
    <div className="login-page">
      <div className="login-form">
        <LoginForm onClickLoginAsync={loginUserAsync} errorMessage={error} />
      </div>
    </div>
  );
};
