import type { TodoDto } from "../../dtos/TodoDto.tsx";

type TodoTableRowProps = {
  todo: TodoDto;
  onEdit: () => void;
  onRemove: () => void;
};

export const TodoTableRow = ({ todo, onEdit, onRemove }: TodoTableRowProps) => {
  return (
    <tr className="todo-table__row" onDoubleClick={onEdit}>
      <td className="todo-table__cell todo-table__cell--name">{todo.name}</td>
      <td className="todo-table__cell todo-table__cell--description">{todo.description}</td>
      <td className="todo-table__cell todo-table__cell--date">{todo.createdAt}</td>
      <td className="todo-table__cell todo-table__cell--actions">
        <div className="todo-table__actions">
          <button
            className="todo-table__action-button todo-table__action-button--edit"
            onClick={onEdit}
          >
            Edit
          </button>
          <button
            className="todo-table__action-button todo-table__action-button--remove"
            onClick={onRemove}
          >
            Remove
          </button>
        </div>
      </td>
    </tr>
  );
};
