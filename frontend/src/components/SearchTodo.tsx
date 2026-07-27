import type { ChangeEvent } from "react";

type SearchTodoProps = {
  onSearchChange: (query: string) => void;
};

export const SearchTodo = ({ onSearchChange }: SearchTodoProps) => {
  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    onSearchChange(e.target.value);
  };

  return (
    <input
      className="todo-dashboard-controls__search-input"
      type="text"
      onChange={onChange}
      placeholder="Search by name, description, created date..."
    />
  );
};
