import type { TodoDto } from "../../dtos/TodoDto.tsx";
import type { TodoDraft } from "../../types/TodoDraft.tsx";

type TodoTableRowProps = {
  todo: TodoDto;
  onEdit: () => void;
  onRemove: (todo: TodoDto, action: TodoDraft["action"]) => void;
};

export const TodoTableRow = ({ todo, onEdit, onRemove }: TodoTableRowProps) => {
  return (
    <tr className="todo-table__row">
      <td className="todo-table__cell todo-table__cell--name">{todo.name}</td>
      <td className="todo-table__cell todo-table__cell--description">
        {todo.description}
      </td>
      <td className="todo-table__cell todo-table__cell--date">
        {todo.createdAt}
      </td>
      <td className="todo-table__cell todo-table__cell--actions">
        <div className="todo-table__actions">
          <button
            className="todo-table__action-button todo-table__action-button--remove"
            onClick={() => onRemove(todo, "remove")}
          >
            Remove
          </button>
        </div>
      </td>
    </tr>
  );
};
