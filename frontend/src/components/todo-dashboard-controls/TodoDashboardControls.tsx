import { SearchBar } from "./SearchBar.tsx";
import { TodoFilterSelect } from "./TodoFilterSelect.tsx";
import type { TodoFilter } from "../../types/TodoFilter.tsx";

type TodoDashboardControlsProps = {
  isEditing: boolean;
  isLoading: boolean;
  onSave: () => void;
  onCancel: () => void;
  onSearch: (query: string) => void;
  onFilter: (filter: TodoFilter) => void;
  onCreate: () => void;
};

export const TodoDashboardControls = ({
  isEditing,
  isLoading,
  onSave,
  onCancel,
  onSearch,
  onFilter,
  onCreate,
}: TodoDashboardControlsProps) => {
  return (
    <div className="todo-dashboard-controls">
      <div className="todo-dashboard-controls__search">
        <SearchBar
          placeholder={"Search by Name, Description, Created date..."}
          onSearch={onSearch}
        />
      </div>
      <div className="todo-dashboard-controls__filter">
        <TodoFilterSelect onFilter={onFilter} />
      </div>
      <div className="todo-dashboard-controls__create">
        <button
          className="create-button"
          type="button"
          disabled={isLoading}
          onClick={onCreate}
        >
          Create New
        </button>
      </div>
      <div className="todo-dashboard-controls__save-edit">
        <button
          className="save-edit-button"
          type="button"
          disabled={isLoading || !isEditing}
          onClick={onSave}
        >
          Save
        </button>
      </div>
      <div className="todo-dashboard-controls__cancel-edit">
        <button
          className="cancel-edit-button"
          type="button"
          disabled={isLoading || !isEditing}
          onClick={onCancel}
        >
          Cancel
        </button>
      </div>
    </div>
  );
};
