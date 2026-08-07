import { useState } from "react";
import { RegisterForm } from "../components/user-authentication/RegisterForm";
import { apiClient } from "../utils/api";
import { useNavigate } from "react-router-dom";
import { getErrorMessage } from "../utils/errorUtils";

export const Register = () => {
  const navigate = useNavigate();
  
  const [error, setError] = useState<string>("");

  const registerUserAsync = async (username: string, password: string) => {
    try {
      await apiClient.post("/api/users/register", {
        username,
        password,
      });

      navigate("/login");
    } catch (err: any) {
      setError(getErrorMessage(err));
    }
  };

  return (
    <div>
      {error && <p className="status-message status-message--error">{error}</p>}
      <RegisterForm onClickRegisterAsync={registerUserAsync} />
    </div>
  );
};
