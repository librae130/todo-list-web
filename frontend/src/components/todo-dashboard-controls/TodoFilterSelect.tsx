export type TodoFilterOption = "all" | "name" | "description" | "createdDate";

type TodoFilterSelectProps = {
  onFilter: (filter: TodoFilterOption) => void;
};

export const TodoFilterSelect = ({ onFilter }: TodoFilterSelectProps) => {
  return (
    <select
      className="todo-filter-select"
      onChange={(event) => onFilter(event.target.value as TodoFilterOption)}
      defaultValue="all"
    >
      <option value="all">All Fields</option>
      <option value="name">Name Only</option>
      <option value="description">Description Only</option>
      <option value="createdDate">Created Date</option>
    </select>
  );
};
