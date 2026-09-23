import { useState } from "react";
import { Link } from "react-router-dom";

type RegisterFormProps = {
  onRegisterAsync: (username: string, password: string) => Promise<void>;
  errorMessage?: string;
};

export const RegisterForm = ({
  onRegisterAsync,
  errorMessage,
}: RegisterFormProps) => {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [isRegistering, setIsRegistering] = useState<boolean>(false);
  const [validationError, setValidationError] = useState<string>("");

  const handleRegister = async (e: any) => {
    e.preventDefault();

    setValidationError("");

    var newError: string = "";

    if (password.trim().length < 8) {
      newError = "Password must be longer than 8 characters";
    }

    if (username.trim() === "") {
      newError = "Name can not be blank";
    }

    if (newError.length > 0) {
      setValidationError(newError);
      return;
    }

    setIsRegistering(true);
    await onRegisterAsync(username, password);
    setIsRegistering(false);
  };

  return (
    <form className="form-register" onSubmit={handleRegister}>
      <h1>Register</h1>
      <label className="form-register__label">Username:</label>
      <input
        className="form-register__input form-register__input--name"
        name="name"
        type="text"
        maxLength={50}
        placeholder="Required"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <label className="form-register__label">Password:</label>
      <input
        className="form-register__input form-register__input--password"
        name="password"
        type="password"
        maxLength={50}
        placeholder="Required"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <div className="form-register__input-footer">
        {(validationError || errorMessage) && (
          <p className="form-register__error-message">
            {validationError || errorMessage}
          </p>
        )}
      </div>
      <button
        className="form-register__submit-button"
        type="submit"
        disabled={isRegistering}
      >
        {isRegistering ? "Registering..." : "Confirm"}
      </button>
      <p className="form-register__register-link">
        Already have an account? <Link to="/login">Login here</Link>
      </p>
    </form>
  );
};
