import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { apiClient } from "../utils/api";

export const LoginForm = () => {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [isLoggingIn, setIsLoggingIn] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const navigate = useNavigate();

  const handleLogin = async (e: any) => {
    e.preventDefault();
    setIsLoggingIn(true);
    setError("");

    try {
      const response = await apiClient.post("/api/users/login", {
        username,
        password,
      });
      localStorage.setItem("accessToken", response.data.token);
      navigate("/");
    } catch (err: any) {
      setError(err.response?.data?.message || "An error occurred during login.");
    } finally {
      setIsLoggingIn(false);
    }
  };

  return (
    <form className="form-login" onSubmit={handleLogin}>
      <label className="form-login__label">Username:</label>
      <input
        className="form-login__input form-login__input--name"
        name="name"
        type="text"
        maxLength={50}
        placeholder="Enter Username..."
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <label className="form-login__label">Password:</label>
      <input
        className="form-login__input form-login__input--password"
        name="password"
        type="password"
        maxLength={50}
        placeholder="Enter Password..."
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <div className="modal__input__footer">
        {error && <p className="modal__error-message">{error}</p>}
      </div>
      <button className="modal__submit-button" type="submit" disabled={isLoggingIn}>
        {isLoggingIn ? "Logging In..." : "Log In"}
      </button>
      <p className="form-login__register-link">
        Don't have an account? <Link to="/register">Register here</Link>
      </p>
    </form>
  );
};
