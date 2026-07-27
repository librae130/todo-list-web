import { useState } from "react";
<<<<<<< HEAD
<<<<<<< HEAD
import { useNavigate, Link } from "react-router-dom";
import { apiClient } from "../utils/api";

export const RegisterForm = () => {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [isRegistering, setIsRegistering] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const navigate = useNavigate();

  const handleRegister = async (e: any) => {
    e.preventDefault();
    setIsRegistering(true);
    setError("");

    try {
      await apiClient.post("/api/users/register", {
        username,
        password,
      });
      navigate("/login");
    } catch (err: any) {
      setError(err.response?.data?.message || "An error occurred during registration.");
    } finally {
      setIsRegistering(false);
    }
  };
=======
=======
import { useNavigate, Link } from "react-router-dom";
import { apiClient } from "../utils/api";
>>>>>>> 6e08b76 (added temporary login and register)

export const RegisterForm = () => {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [isRegistering, setIsRegistering] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const navigate = useNavigate();

<<<<<<< HEAD
  const handleRegister = () => {};
>>>>>>> ce32cc9 (initial)
=======
  const handleRegister = async (e: any) => {
    e.preventDefault();
    setIsRegistering(true);
    setError("");

    try {
      await apiClient.post("/api/users/register", {
        username,
        password,
      });
      navigate("/login");
    } catch (err: any) {
      setError(err.response?.data?.message || "An error occurred during registration.");
    } finally {
      setIsRegistering(false);
    }
  };
>>>>>>> 6e08b76 (added temporary login and register)

  return (
    <form className="form-login" onSubmit={handleRegister}>
      <label className="form-login__label">Username:</label>
      <input
        className="form-login__input form-login__input--name"
        name="name"
        type="text"
<<<<<<< HEAD
<<<<<<< HEAD
        maxLength={50}
        placeholder="Enter Username..."
        value={username}
        onChange={(e) => setUsername(e.target.value)}
=======
        maxLength={100}
        placeholder="Enter Username..."
>>>>>>> ce32cc9 (initial)
=======
        maxLength={50}
        placeholder="Enter Username..."
        value={username}
        onChange={(e) => setUsername(e.target.value)}
>>>>>>> 6e08b76 (added temporary login and register)
      />
      <label className="form-login__label">Password:</label>
      <input
        className="form-login__input form-login__input--password"
        name="password"
        type="password"
<<<<<<< HEAD
<<<<<<< HEAD
        maxLength={50}
        placeholder="Enter Password..."
        value={password}
        onChange={(e) => setPassword(e.target.value)}
=======
        maxLength={100}
        placeholder="Enter Password..."
>>>>>>> ce32cc9 (initial)
=======
        maxLength={50}
        placeholder="Enter Password..."
        value={password}
        onChange={(e) => setPassword(e.target.value)}
>>>>>>> 6e08b76 (added temporary login and register)
      />
      <div className="modal__input__footer">
        {error && <p className="modal__error-message">{error}</p>}
      </div>
      <button className="modal__submit-button" type="submit" disabled={isRegistering}>
        {isRegistering ? "Registering..." : "Register"}
      </button>
<<<<<<< HEAD
<<<<<<< HEAD
      <p className="form-login__login-link">
        Already have an account? <Link to="/login">Login here</Link>
      </p>
=======
>>>>>>> ce32cc9 (initial)
=======
      <p className="form-login__login-link">
        Already have an account? <Link to="/login">Login here</Link>
      </p>
>>>>>>> 6e08b76 (added temporary login and register)
    </form>
  );
};
