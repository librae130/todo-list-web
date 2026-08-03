import { SearchTodo } from "./SearchTodo.tsx";
import { TodoFilterSelect } from "./TodoFilterSelect.tsx";
import type { TodoFilterOption } from "./TodoFilterSelect.tsx";
import { CreateTodoButton } from "./CreateTodoButton.tsx";
import { LoginButton } from "./LoginButton.tsx";

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
        <SearchTodo onSearchChange={onSearchChange} />
      </div>
      <div className="todo-dashboard-controls__filter">
        <TodoFilterSelect onFilterChange={onFilterChange} />
      </div>
      <div className="todo-dashboard-controls__create">
        <CreateTodoButton onClickCreate={onClickCreate} />
      </div>
      <div className="todo-dashboard-controls__login">
        <LoginButton onClickLogin={onClickLogin} />
      </div>
    </div>
  );
};
