import { SearchBar } from "../SearchBar.tsx";
import { TodoFilterSelect } from "./TodoFilterSelect.tsx";
import type { TodoFilterOption } from "./TodoFilterSelect.tsx";
import { CreateButton } from "../buttons/CreateButton.tsx";
import { LoginButton } from "../buttons/LoginButton.tsx";

type TodoDashboardControlsProps = {
  onSearchChange: (query: string) => void;
  onFilterChange: (filter: TodoFilterOption) => void;
  onClickCreate: () => void;
  onClickLogin: () => void;
};

export const TodoDashboardControls = ({
  onSearchChange,
  onFilterChange,
  onClickCreate,
  onClickLogin,
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
        <CreateButton
          buttonName="Create New"
          onClickCreate={onClickCreate} />
      </div>
      <div className="todo-dashboard-controls__login">
        <LoginButton
          buttonName="Login"
          onClickLogin={onClickLogin} />
      </div>
    </div>
  );
};
