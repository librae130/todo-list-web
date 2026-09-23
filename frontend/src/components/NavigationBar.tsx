import type { UserDto } from "../dtos/UserDto.tsx";

type NavigationBarProps = {
  user: UserDto | null;
  onLogin: () => void;
  onLogout: () => void;
};

export const NavigationBar = ({ user, onLogin, onLogout }: NavigationBarProps) => {
  return (
    <nav className="navigation-bar" aria-label="Main navigation">
      <div className="navigation-bar__brand">Todo List</div>

      <div className="navigation-bar__actions">
        {user ? (
          <button className="logout-button" type="button" onClick={onLogout}>
            Logout
          </button>
        ) : (
          <button className="login-button" type="button" onClick={onLogin}>
            Login
          </button>
        )}
      </div>
    </nav>
  );
};
