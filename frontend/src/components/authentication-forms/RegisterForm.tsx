import { useState } from "react";
import { Link } from "react-router-dom";
import { USER_RESTRAINTS } from "../../constants/user";

type RegisterFormProps = {
  onRegister: (username: string, password: string) => Promise<void>;
  errorMessage?: string;
};

export const RegisterForm = ({ onRegister, errorMessage }: RegisterFormProps) => {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [isRegistering, setIsRegistering] = useState<boolean>(false);
  const [validationError, setValidationError] = useState<string>("");

  const handleRegister = async (e: any) => {
    e.preventDefault();

    setValidationError("");

    var newError: string = "";

    if (password.trim().length < USER_RESTRAINTS.PASSWORD_MIN_LENGTH) {
      newError = `Password must be longer than ${USER_RESTRAINTS.PASSWORD_MIN_LENGTH} characters`;
    }

    if (username.trim() === "") {
      newError = "Name can not be blank";
    }

    if (newError.length > 0) {
      setValidationError(newError);
      return;
    }

    setIsRegistering(true);
    await onRegister(username, password);
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
        placeholder="Required"
        value={username}
        maxLength={USER_RESTRAINTS.NAME_MAX_LENGTH}
        onChange={(e) => setUsername(e.target.value)}
      />
      <label className="form-register__label">Password:</label>
      <input
        className="form-register__input form-register__input--password"
        name="password"
        type="password"
        placeholder="Required"
        value={password}
        maxLength={USER_RESTRAINTS.PASSWORD_MAX_LENGTH}
        onChange={(e) => setPassword(e.target.value)}
      />
      <div className="form-register__input-footer">
        {(validationError || errorMessage) && (
          <p className="form-register__error-message">{validationError || errorMessage}</p>
        )}
      </div>
      <button className="form-register__submit-button" type="submit" disabled={isRegistering}>
        {isRegistering ? "Registering..." : "Confirm"}
      </button>
      <p className="form-register__register-link">
        Already have an account? <Link to="/login">Login here</Link>
      </p>
    </form>
  );
};
