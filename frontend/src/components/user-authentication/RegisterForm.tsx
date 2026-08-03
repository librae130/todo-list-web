import { useState } from "react";
import { Link, redirect } from "react-router-dom";

type RegisterFormProps = {
  onRegister: (username: string, password: string) => void;
};

export const RegisterForm = ({ onRegister }: RegisterFormProps) => {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [isRegistering, setIsRegistering] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const handleRegister = async (e: any) => {
    e.preventDefault();

    setError("");

    var newError: string = "";

    if (password.trim().length < 8) {
      newError = "Password must be longer than 8 characters.";
    }

    if (username.trim() === "") {
      newError = "Name can not be blank.";
    }

    if (newError.length > 0) {
      setError(newError);
      return;
    }

    setIsRegistering(true);
    onRegister(username, password);
    setIsRegistering(false);
  };

  return (
    <form className="form-login" onSubmit={handleRegister}>
      <h1>Register</h1>
      <label className="form-login__label">Username:</label>
      <input
        className="form-login__input form-login__input--name"
        name="name"
        type="text"
        maxLength={50}
        placeholder="Required"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <label className="form-login__label">Password:</label>
      <input
        className="form-login__input form-login__input--password"
        name="password"
        type="password"
        maxLength={50}
        placeholder="Required"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <div className="form-login__input-footer">
        {error && <p className="form-login__error-message">{error}</p>}
      </div>
      <button className="form-login__submit-button" type="submit" disabled={isRegistering}>
        {isRegistering ? "Registering..." : "Register"}
      </button>
      <p className="form-login__login-link">
        Already have an account? <Link to="/login">Login here</Link>
      </p>
    </form>
  );
};
