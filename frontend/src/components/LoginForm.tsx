import { useState } from "react";

type LoginFormProps = {
  onLogin: () => void;
};

export const LoginForm = (onLogin: LoginFormProps) => {
  const [isLoggingIn, setIsLoggingIn] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const handleLogin = () => {};

  return (
    <form className="form-login" onSubmit={handleLogin}>
      <label className="form-login__label">Username:</label>
      <input
        className="form-login__input form-login__input--name"
        name="name"
        type="text"
        maxLength={100}
        placeholder="Enter Username..."
      />
      <label className="form-login__label">Password:</label>
      <input
        className="form-login__input form-login__input--password"
        name="password"
        type="text"
        maxLength={100}
        placeholder="Enter Password..."
      />
      <div className="modal__input__footer">
        {error && <p className="modal__error-message">{error}</p>}
      </div>
      <button className="modal__submit-button" type="submit" disabled={isLoggingIn}>
        {isLoggingIn ? "Logging In..." : "Log In"}
      </button>
    </form>
  );
};
