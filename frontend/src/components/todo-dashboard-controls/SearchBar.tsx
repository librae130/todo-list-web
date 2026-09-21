import { useDebounceFunction } from "../../utils/debounce";

type SearchBarProps = {
  placeholder: string;
  onSearchChange: (query: string) => void;
};

export const SearchBar = ({ placeholder, onSearchChange }: SearchBarProps) => {
  const debouncedOnSearchChange = useDebounceFunction(onSearchChange, 500);

  const onChange = (e: any) => {
    debouncedOnSearchChange(e.target.value);
  };

  return (
    <input
      className="search-bar__input"
      type="text"
      onChange={onChange}
      placeholder={placeholder}
    />
  );
};
