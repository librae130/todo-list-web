import { SearchTodo } from "./SearchTodo.tsx";
import { TodoFilterSelect } from "./TodoFilterSelect.tsx";
import type { TodoFilterOption } from "./TodoFilterSelect.tsx";
import { CreateTodoButton } from "./CreateTodoButton.tsx";

type TodoDashboardControlsProps = {
  onSearchChange: (query: string) => void;
  onFilterChange: (filter: TodoFilterOption) => void;
  onCreate: () => void;
};

export const TodoDashboardControls = ({
  onSearchChange,
  onFilterChange,
  onCreate,
}: TodoDashboardControlsProps) => {
  return (
    <div className="todo-dashboard-controls">
      <div className="todo-dashboard-controls__search">
        <SearchTodo onSearchChange={onSearchChange} />
      </div>
      <div className="todo-dashboard-controls__filter">
        <TodoFilterSelect onFilterChange={onFilterChange} />
      </div>
      <div className="todo-dashboard-controls__actions">
        <CreateTodoButton onCreate={onCreate} />
      </div>
    </div>
  );
};
