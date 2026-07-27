import { RegisterForm } from "../components/RegisterForm";

const Register = () => {
  const handleRegister = () => {
    // Handle register logic
  };

  return (
    <div>
      <h1>Register</h1>
      <RegisterForm onRegister={handleRegister} />
    </div>
  );
};

export default Register;
