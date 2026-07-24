export const CreateTodoButton = ({onClick}: {onClick:any}) => {
  const handleClick = () => {
    onClick(true);
  }

  return (
    <button className="todo-dashboard-controls__create-button button button--create-todo" type="button" onClick={handleClick}>
      Create New
    </button>
  );
}
