import { LoginForm } from "../components/LoginForm";

const Login = () => {
<<<<<<< HEAD
  return (
    <div>
      <h1>Login</h1>
      <LoginForm />
=======
  const handleLogin = () => {
    // Handle login logic
  };

  return (
    <div>
      <h1>Login</h1>
      <LoginForm onLogin={handleLogin} />
>>>>>>> ce32cc9 (initial)
    </div>
  );
};

export default Login;

