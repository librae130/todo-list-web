import { useDebounceFunction } from "../../utils/debounce";

type SearchBarProps = {
  placeholder: string;
  onSearch: (query: string) => void;
};

export const SearchBar = ({ placeholder, onSearch }: SearchBarProps) => {
  const debouncedOnSearchChange = useDebounceFunction(onSearch, 500);

  const handleSearch = (event: any) => {
    debouncedOnSearchChange(event.target.value);
  };

  return (
    <input
      className="search-bar__input"
      type="text"
      onChange={handleSearch}
      placeholder={placeholder}
    />
  );
};
