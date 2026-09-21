import { useState } from "react";
import { RegisterForm } from "../components/authentication-forms/RegisterForm";
import { AuthService } from "../services/AuthService";
import { useNavigate } from "react-router-dom";
import { getErrorMessage } from "../utils/errorUtils";

export const Register = () => {
  const navigate = useNavigate();

  const [error, setError] = useState<string>("");

  const registerUserAsync = async (username: string, password: string) => {
    try {
      await AuthService.register(username, password);

      navigate("/login");
    } catch (error: any) {
      setError(getErrorMessage(error));
    }
  };

  return (
    <div className="register-page">
      <div className="register-form">
        <RegisterForm onClickRegisterAsync={registerUserAsync} errorMessage={error} />
      </div>
    </div>
  );
};
