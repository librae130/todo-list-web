import { useDebounceFunction } from "../utils/debounce";

type SearchTodoProps = {
  onSearchChange: (query: string) => void;
};

export const SearchTodo = ({ onSearchChange }: SearchTodoProps) => {
  const debouncedOnSearchChange = useDebounceFunction(onSearchChange, 500);

  const onChange = (e: any) => {
    debouncedOnSearchChange(e.target.value);
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
