import { RegisterForm } from "../components/RegisterForm";

const Register = () => {
<<<<<<< HEAD
  return (
    <div>
      <h1>Register</h1>
      <RegisterForm />
=======
  const handleRegister = () => {
    // Handle register logic
  };

  return (
    <div>
      <h1>Register</h1>
      <RegisterForm onRegister={handleRegister} />
>>>>>>> ce32cc9 (initial)
    </div>
  );
};

export default Register;
