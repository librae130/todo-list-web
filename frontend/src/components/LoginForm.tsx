import { useState } from "react";
<<<<<<< HEAD
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
=======

type LoginFormProps = {
  onLogin: () => void;
};

export const LoginForm = (onLogin: LoginFormProps) => {
  const [isLoggingIn, setIsLoggingIn] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const handleLogin = () => {};
>>>>>>> ce32cc9 (initial)

  return (
    <form className="form-login" onSubmit={handleLogin}>
      <label className="form-login__label">Username:</label>
      <input
        className="form-login__input form-login__input--name"
        name="name"
        type="text"
<<<<<<< HEAD
        maxLength={50}
        placeholder="Enter Username..."
        value={username}
        onChange={(e) => setUsername(e.target.value)}
=======
        maxLength={100}
        placeholder="Enter Username..."
>>>>>>> ce32cc9 (initial)
      />
      <label className="form-login__label">Password:</label>
      <input
        className="form-login__input form-login__input--password"
        name="password"
<<<<<<< HEAD
        type="password"
        maxLength={50}
        placeholder="Enter Password..."
        value={password}
        onChange={(e) => setPassword(e.target.value)}
=======
        type="text"
        maxLength={100}
        placeholder="Enter Password..."
>>>>>>> ce32cc9 (initial)
      />
      <div className="modal__input__footer">
        {error && <p className="modal__error-message">{error}</p>}
      </div>
      <button className="modal__submit-button" type="submit" disabled={isLoggingIn}>
        {isLoggingIn ? "Logging In..." : "Log In"}
      </button>
<<<<<<< HEAD
      <p className="form-login__register-link">
        Don't have an account? <Link to="/register">Register here</Link>
      </p>
=======
>>>>>>> ce32cc9 (initial)
    </form>
  );
};
