type CreateTodoButtonProps = {
  onCreate: () => void;
};

export const CreateTodoButton = ({ onCreate }: CreateTodoButtonProps) => {
  return (
    <button
      className="todo-dashboard-controls__create-button"
      type="button"
      onClick={onCreate}
    >
      Create New
    </button>
  );
};
