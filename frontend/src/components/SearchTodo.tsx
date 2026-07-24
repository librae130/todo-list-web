export const SearchTodo = ({ onSearchChange }: { onSearchChange: any }) => {
  const onChange = (e: any) => {
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
