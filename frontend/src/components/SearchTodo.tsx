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
      className="search-todo__input"
      type="text"
      onChange={onChange}
      placeholder="Search by Name, Description, Created date..."
    />
  );
};
