import { useState } from "react";
import { Link } from "react-router-dom";

type LoginFormProps = {
  onClickLoginAsync: (username: string, password: string) => Promise<void>;
  errorMessage?: string;
};

export const LoginForm = ({ onClickLoginAsync, errorMessage }: LoginFormProps) => {
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
    await onClickLoginAsync(username, password);
    setIsLoggingIn(false);
  };

  return (
    <form className="form-login" onSubmit={handleLogin}>
      <h1>Login</h1>
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
