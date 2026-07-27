import { useState } from "react";

type RegisterFormProps = {
  onRegister: () => void;
};

export const RegisterForm = (onRegister: RegisterFormProps) => {
  const [isRegistering, setIsRegistering] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const handleRegister = () => {};

  return (
    <form className="form-login" onSubmit={handleRegister}>
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
        type="password"
        maxLength={100}
        placeholder="Enter Password..."
      />
      <div className="modal__input__footer">
        {error && <p className="modal__error-message">{error}</p>}
      </div>
      <button className="modal__submit-button" type="submit" disabled={isRegistering}>
        {isRegistering ? "Registering..." : "Register"}
      </button>
    </form>
  );
};
