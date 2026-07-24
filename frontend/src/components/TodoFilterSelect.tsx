export type TodoFilterOption = "all" | "name" | "description" | "createdDate";

export const TodoFilterSelect = ({ onFilterChange }: { onFilterChange: any }) => {
  return (
    <select
      className="todo-filter-select"
      onChange={(e) => onFilterChange(e.target.value as TodoFilterOption)}
      defaultValue="all"
    >
      <option value="all">All Fields</option>
      <option value="name">Name Only</option>
      <option value="description">Description Only</option>
      <option value="createdDate">Created Date</option>
    </select>
  );
};
