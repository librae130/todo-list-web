import { SearchBar } from "./SearchBar.tsx";
import { TodoFilterSelect } from "./TodoFilterSelect.tsx";
import type { TodoFilterOption } from "./TodoFilterSelect.tsx";
import type { UserDto } from "../../dtos/UserDto.tsx";

type TodoDashboardControlsProps = {
  user: UserDto | null;
  onSearchChange: (query: string) => void;
  onFilterChange: (filter: TodoFilterOption) => void;
  onClickCreate: () => void;
  onClickLogin: () => void;
  onClickLogout: () => void;
};

export const TodoDashboardControls = ({
  user,
  onSearchChange,
  onFilterChange,
  onClickCreate,
  onClickLogin,
  onClickLogout,
}: TodoDashboardControlsProps) => {
  return (
    <div className="todo-dashboard-controls">
      <div className="todo-dashboard-controls__search">
        <SearchBar
          placeholder={"Search by Name, Description, Created date..."}
          onSearchChange={onSearchChange}
        />
      </div>
      <div className="todo-dashboard-controls__filter">
        <TodoFilterSelect onFilterChange={onFilterChange} />
      </div>
      <div className="todo-dashboard-controls__create">
        <button className="create-button" type="button" onClick={onClickCreate}>
          Create New
        </button>
      </div>
      {user ? (
        <div className="todo-dashboard-controls__logout">
          <button className="logout-button" type="button" onClick={onClickLogout}>
            Logout
          </button>
        </div>
      ) : (
        <div className="todo-dashboard-controls__login">
          <button className="login-button" type="button" onClick={onClickLogin}>
            Login
          </button>
        </div>
      )}
    </div>
  );
};
