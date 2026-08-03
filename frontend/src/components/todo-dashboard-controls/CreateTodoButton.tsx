type CreateTodoButtonProps = {
  onClickCreate: () => void;
};

export const CreateTodoButton = ({ onClickCreate }: CreateTodoButtonProps) => {
  return (
    <button
      className="todo-dashboard-controls__create-button"
      type="button"
      onClick={onClickCreate}
    >
      Create New
    </button>
  );
};
