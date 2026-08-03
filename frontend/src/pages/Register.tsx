import { useState } from "react";
import { RegisterForm } from "../components/user-authentication/RegisterForm";
import { apiClient } from "../utils/api";
import { useNavigate } from "react-router-dom";

export const Register = () => {
  const navigate = useNavigate();
  const [error, setError] = useState();
  const registerUser = async (username: string, password: string) => {
    try {
      await apiClient.post("/api/users/register", {
        username,
        password,
      });

      navigate("/login");
    } catch (err: any) {
      return Error(err.response?.data?.message || "An error occurred during registration.");
    }
  };

  return (
    <div>
      {error && <p className="status-message status-message--error">{error}</p>}
      <RegisterForm onRegister={registerUser} />
    </div>
  );
};
