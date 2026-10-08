import { LoginForm } from "../components/authentication-forms/LoginForm";
import { useUser } from "../hooks/useUser";

export const Login = () => {
  const { error, login } = useUser();

  return (
    <div className="login-page">
      <div className="login-form">
        <LoginForm onLogin={login} errorMessage={error} />
      </div>
    </div>
  );
};
