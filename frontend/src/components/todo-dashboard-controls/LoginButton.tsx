type LoginButtonProps = {
  onClickLogin: () => void;
}

export const LoginButton = ({ onClickLogin }: LoginButtonProps) => {
  return (
    <button
      className="todo-dashboard-controls__login-button"
      type="button"
      onClick={onClickLogin}
    >
      Login
    </button>
  );
};
