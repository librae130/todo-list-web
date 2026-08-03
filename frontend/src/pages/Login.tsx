import { LoginForm } from "../components/user-authentication/LoginForm";
import { useNavigate } from "react-router-dom";
import { apiClient } from "../utils/api";

export const Login = () => {
  const navigate = useNavigate();

  const loginUser = async (username: string, password: string) => {
    try {
      const response = await apiClient.post("/api/users/login", {
        username,
        password,
      });

      localStorage.setItem("token", response.data.token);

      navigate("/");
    } catch (err: any) {
      return Error(err.response?.data?.message || "An error occurred during registration.");
    }
  }

  return (
    <div>
      <LoginForm onLogin={loginUser} />
    </div>
  );
};
