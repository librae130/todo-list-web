import type { TodoDTO } from "../dtos/TodoDTO.tsx";
import type { RefObject } from "react";
import type { UpdateTodoDTO } from "../dtos/UpdateTodoDTO.tsx";
import type { CreateTodoDTO } from "../dtos/CreateTodoDTO.tsx";
import { TodoTableRow } from "./TodoTableRow.tsx";
import { NewTodoTableRow } from "./NewTodoTableRow.tsx";

type TodoTableProps = {
  data: TodoDTO[];
  showCreateRow: boolean;
  //onEdit: (editMode: boolean, id: string | null) => void;
  onClickCreate: (newTodo: CreateTodoDTO) => Promise<void>;
  onCloseCreateRow: () => void;
  onClickEdit: (
    editingTodoId: string,
    updatedTodo: UpdateTodoDTO,
  ) => Promise<void>;
  onClickDelete: (id: string) => Promise<void>;
  createRowRef: RefObject<HTMLTableRowElement | null>;
};

export const TodoTable = ({
  data,
  showCreateRow,
  onCloseCreateRow,
  onClickCreate,
  onClickEdit,
  onClickDelete,
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
            onClickCreate={onClickCreate}
            onCloseCreateRow={onCloseCreateRow}
            ref={createRowRef}
          />
        )}
        {data.map((todo: TodoDTO) => (
          <TodoTableRow
            key={todo.id}
            todo={todo}
            onClickEdit={onClickEdit}
            onClickDelete={onClickDelete}
          />
        ))}
      </tbody>
    </table>
  );
};
