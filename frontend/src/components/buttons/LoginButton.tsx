type LoginButtonProps = {
  buttonName: string;
  onClickLogin: () => void;
}

export const LoginButton = ({ buttonName, onClickLogin }: LoginButtonProps) => {
  return (
    <button
      className="login-button"
      type="button"
      onClick={onClickLogin}
    >
      {buttonName || "Login"}
    </button>
  );
};
