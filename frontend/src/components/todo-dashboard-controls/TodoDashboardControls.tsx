import { SearchBar } from "./SearchBar.tsx";
import { TodoFilterSelect } from "./TodoFilterSelect.tsx";
import type { TodoFilterOption } from "./TodoFilterSelect.tsx";

type TodoDashboardControlsProps = {
  onSearchChange: (query: string) => void;
  onFilterChange: (filter: TodoFilterOption) => void;
  onClickCreate: () => void;
};

export const TodoDashboardControls = ({
  onSearchChange,
  onFilterChange,
  onClickCreate,
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
    </div>
  );
};
