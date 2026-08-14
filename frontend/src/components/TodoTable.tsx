import type { TodoDto } from "../dtos/TodoDto.tsx";
import type { RefObject } from "react";
import type { UpdateTodoDto } from "../dtos/UpdateTodoDto.tsx";
import type { AddTodoDto } from "../dtos/AddTodoDto.tsx";
import { TodoTableRow } from "./TodoTableRow.tsx";
import { NewTodoTableRow } from "./NewTodoTableRow.tsx";

type TodoTableProps = {
  data: TodoDto[];
  showCreateRow: boolean;
  //onEdit: (editMode: boolean, id: string | null) => void;
  onClickCreateAsync: (newTodo: AddTodoDto) => Promise<void>;
  onCloseCreateRow: () => void;
  onClickEditAsync: (
    editingTodoId: string,
    updatedTodo: UpdateTodoDto,
  ) => Promise<void>;
  onClickRemoveAsync: (id: string) => Promise<void>;
  createRowRef: RefObject<HTMLTableRowElement | null>;
};

export const TodoTable = ({
  data,
  showCreateRow,
  onCloseCreateRow,
  onClickCreateAsync,
  onClickEditAsync,
  onClickRemoveAsync,
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
            onClickCreateAsync={onClickCreateAsync}
            onCloseCreateRow={onCloseCreateRow}
            ref={createRowRef}
          />
        )}
        {data.map((todo: TodoDto) => (
          <TodoTableRow
            key={todo.id}
            todo={todo}
            onClickEditAsync={onClickEditAsync}
            onClickRemoveAsync={onClickRemoveAsync}
          />
        ))}
      </tbody>
    </table>
  );
};
