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
  onCreate: (newTodo: CreateTodoDTO) => void;
  onCloseCreateRow: () => void;
  onEdit: (editingTodoId:string,updatedTodo: UpdateTodoDTO) => void;
  onDelete: (id: string) => void;
  createRowRef: RefObject<HTMLTableRowElement|null>;
};

export const TodoTable = ({
  data,
  showCreateRow,
  onCloseCreateRow,
  onCreate,
  onEdit,
  onDelete,
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
            onCreate={onCreate}
            onCloseCreateRow={onCloseCreateRow}
            ref={createRowRef}
          />
        )}
        {data.map((todo: TodoDTO) => (
          <TodoTableRow
            key={todo.id}
            todo={todo}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))}
      </tbody>
    </table>
  );
};
