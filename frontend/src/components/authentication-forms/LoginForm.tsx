import { useState } from "react";
import { Link } from "react-router-dom";
import { USER_RESTRAINTS } from "../../constants/user";

type LoginFormProps = {
  onLogin: (username: string, password: string) => Promise<void>;
  errorMessage?: string;
};

export const LoginForm = ({ onLogin, errorMessage }: LoginFormProps) => {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [isLoggingIn, setIsLoggingIn] = useState<boolean>(false);
  const [validationError, setValidationError] = useState<string>("");

  const handleLogin = async (e: any) => {
    e.preventDefault();

    setValidationError("");

    var newError: string = "";

    if (password.trim() === "") {
      newError = "Password can not be blank";
    }
    if (username.trim() === "") {
      newError = "Name can not be blank";
    }

    if (newError.length > 0) {
      setValidationError(newError);
      return;
    }

    setIsLoggingIn(true);
    await onLogin(username, password);
    setIsLoggingIn(false);
  };

  return (
    <form className="form-login" onSubmit={handleLogin}>
      <h1>Login</h1>
      <label className="form-login__label">Username:</label>
      <input
        className="form-login__input form-login__input--name"
        type="text"
        placeholder="Required"
        value={username}
        maxLength={USER_RESTRAINTS.NAME_MAX_LENGTH}

        onChange={(e) => setUsername(e.target.value)}
      />
      <label className="form-login__label">Password:</label>
      <input
        className="form-login__input form-login__input--password"
        name="password"
        type="password"
        placeholder="Required"
        value={password}
        maxLength={USER_RESTRAINTS.PASSWORD_MAX_LENGTH}
        onChange={(e) => setPassword(e.target.value)}
      />
      <div className="form-login__input-footer">
        {(validationError || errorMessage) && (
          <p className="form-login__error-message">{validationError || errorMessage}</p>
        )}
      </div>
      <button className="form-login__submit-button" type="submit" disabled={isLoggingIn}>
        {isLoggingIn ? "Logging In..." : "Confirm"}
      </button>
      <p className="form-login__register-link">
        Don't have an account? <Link to="/register">Register here</Link>
      </p>
    </form>
  );
};
