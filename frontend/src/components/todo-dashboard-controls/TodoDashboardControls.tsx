import { SearchBar } from "./SearchBar.tsx";
import { TodoFilterSelect } from "./TodoFilterSelect.tsx";
import type { TodoFilterOption } from "./TodoFilterSelect.tsx";

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
        <SearchBar
          placeholder={"Search by Name, Description, Created date..."}
          onSearchChange={onSearchChange}
        />
      </div>
      <div className="todo-dashboard-controls__filter">
        <TodoFilterSelect onFilterChange={onFilterChange} />
      </div>
      <div className="todo-dashboard-controls__create">
        <button className="create-button" type="button" onClick={onCreate}>
          Create New
        </button>
      </div>
      <div className="todo-dashboard-controls__save-edit">
        <button className="save-edit-button" type="button" onClick={onCreate}>
          Save
        </button>
      </div>
      <div className="todo-dashboard-controls__save-edit">
        <button className="save-edit-button" type="button" onClick={onCreate}>
          Cancel
        </button>
      </div>
    </div>
  );
};
