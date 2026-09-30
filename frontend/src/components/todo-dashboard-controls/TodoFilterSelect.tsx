import type { TodoFilter } from "../../types/TodoFilter";

type TodoFilterSelectProps = {
  onFilter: (filter: TodoFilter) => void;
};

export const TodoFilterSelect = ({ onFilter }: TodoFilterSelectProps) => {
  return (
    <select
      className="todo-filter-select"
      onChange={(event) => onFilter(event.target.value as TodoFilter)}
      defaultValue="all"
    >
      <option value="all">All Fields</option>
      <option value="name">Name</option>
      <option value="description">Description</option>
      <option value="createdDate">Created Date</option>
    </select>
  );
};
