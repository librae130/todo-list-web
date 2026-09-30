import { RegisterForm } from "../components/authentication-forms/RegisterForm";
import { useUser } from "../hooks/useUser";

export const Register = () => {
  const { error, register } = useUser();

  return (
    <div className="register-page">
      <div className="register-form">
        <RegisterForm onRegister={register} errorMessage={error} />
      </div>
    </div>
  );
};
