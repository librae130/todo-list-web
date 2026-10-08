import { SEARCH_DELAY } from "../../constants/delay";
import { useDebounce } from "../../hooks/useDebounce";

type SearchBarProps = {
  placeholder: string;
  onSearch: (query: string) => void;
};

export const SearchBar = ({ placeholder, onSearch }: SearchBarProps) => {
  const onSearchDebounced = useDebounce(onSearch, SEARCH_DELAY);

  const handleSearch = (event: any) => {
    onSearchDebounced(event.target.value);
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
