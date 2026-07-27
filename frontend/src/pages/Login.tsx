import { LoginForm } from "../components/LoginForm";

const Login = () => {
  const handleLogin = () => {
    // Handle login logic
  };

  return (
    <div>
      <h1>Login</h1>
      <LoginForm onLogin={handleLogin} />
    </div>
  );
};

export default Login;

