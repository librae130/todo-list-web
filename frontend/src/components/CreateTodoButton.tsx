type CreateTodoButtonProps = {
  onClick: (open: boolean) => void;
};

export const CreateTodoButton = ({ onClick }: CreateTodoButtonProps) => {
  const handleClick = () => {
    onClick(true);
  };

  return (
    <button
      className="todo-dashboard-controls__create-button button button--create-todo"
      type="button"
      onClick={handleClick}
    >
      Create New
    </button>
  );
};
