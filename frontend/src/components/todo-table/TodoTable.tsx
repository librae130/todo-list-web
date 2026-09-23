import type { TodoDto } from "../../dtos/TodoDto.tsx";
import type { RefObject } from "react";
import type { UpdateTodoDto } from "../../dtos/UpdateTodoDto.tsx";
import type { AddTodoDto } from "../../dtos/AddTodoDto.tsx";
import { TodoTableRow } from "./TodoTableRow.tsx";
import { NewTodoTableRow } from "./NewTodoTableRow.tsx";

type TodoTableProps = {
  todos: TodoDto[];
  showCreateRow: boolean;
  //onEdit: (editMode: boolean, id: string | null) => void;
  onCreateAsync: (newTodo: AddTodoDto) => Promise<void>;
  onCloseCreateRow: () => void;
  onEditAsync: (
    editingTodoId: string,
    updatedTodo: UpdateTodoDto,
  ) => Promise<void>;
  onRemoveAsync: (id: string) => Promise<void>;
  createRowRef: RefObject<HTMLTableRowElement | null>;
};

export const TodoTable = ({
  todos,
  showCreateRow,
  onCloseCreateRow,
  onCreateAsync,
  onEditAsync,
  onRemoveAsync,
  createRowRef,
}: TodoTableProps) => {
  return (
    <table className="todo-table">
      <thead className="todo-table__header">
        <tr className="todo-table__header-row">
          <th className="todo-table__header-cell todo-table__header-cell--name">
            Name
          </th>
          <th className="todo-table__header-cell todo-table__header-cell--description">
            Description
          </th>
          <th className="todo-table__header-cell todo-table__header-cell--date">
            Created Date
          </th>
          <th className="todo-table__header-cell todo-table__header-cell--action">
            Action
          </th>
        </tr>
      </thead>
      <tbody className="todo-table__body">
        {showCreateRow && (
          <NewTodoTableRow
            onCreateAsync={onCreateAsync}
            onCloseCreateRow={onCloseCreateRow}
            ref={createRowRef}
          />
        )}
        {todos.map((todo: TodoDto) => (
          <TodoTableRow
            key={todo.id}
            todo={todo}
            onEditAsync={onEditAsync}
            onRemoveAsync={onRemoveAsync}
          />
        ))}
      </tbody>
    </table>
  );
};
