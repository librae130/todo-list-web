import { SearchTodo } from "./SearchTodo.tsx";
import { TodoFilterSelect } from "./TodoFilterSelect.tsx";
import { CreateTodoButton } from "./CreateTodoButton.tsx";

export const TodoDashboardControls = ({
  onSearchChange,
  onFilterChange,
  onCreate,
}: {
  onSearchChange: any;
  onFilterChange: any;
  onCreate: any;
}) => {
  return (
    <div className="todo-dashboard-controls">
      <div className="todo-dashboard-controls__search">
        <SearchTodo onSearchChange={onSearchChange} />
      </div>
      <div className="todo-dashboard-controls__filter">
        <TodoFilterSelect onFilterChange={onFilterChange} />
      </div>
      <div className="todo-dashboard-controls__actions">
        <CreateTodoButton onClick={onCreate} />
      </div>
    </div>
  );
};
