import type { TodoDto } from "../../dtos/TodoDto.tsx";

type TodoTableRowProps = {
  isLoading: boolean;
  todo: TodoDto;
  onEdit: () => void;
  onRemove: () => void;
};

export const TodoTableRow = ({
  isLoading,
  todo,
  onEdit,
  onRemove,
}: TodoTableRowProps) => {
  return (
    <tr className="todo-table__row" onDoubleClick={onEdit}>
      <td className="todo-table__cell todo-table__cell--name">{todo.name}</td>
      <td className="todo-table__cell todo-table__cell--description">
        {todo.description}
      </td>
      <td className="todo-table__cell todo-table__cell--date">
        {todo.createdAt}
      </td>
      <td className="todo-table__cell todo-table__cell--action">
        <div className="todo-table__action">
          <button
            className="todo-table__action-button todo-table__action-button--edit"
            type="button"
            disabled={isLoading}
            onClick={onEdit}
          >
            Edit
          </button>
          <button
            className="todo-table__action-button todo-table__action-button--remove"
            type="button"
            disabled={isLoading}
            onClick={onRemove}
          >
            Remove
          </button>
        </div>
      </td>
    </tr>
  );
};
