import type { TodoDto } from "../../dtos/TodoDto.tsx";
import { TodoTableRow } from "./TodoTableRow.tsx";
import type { TodoDraft, TodoDraftChanges } from "../../types/TodoDraft.tsx";
import { TodoTableDraftRow } from "./TodoTableDraftRow.tsx";

type TodoTableProps = {
  todos: TodoDto[];
  todoDrafts: TodoDraft[];
  onDraftAdd: (todo: TodoDto | null, action: TodoDraft["action"]) => void;
  onDraftUpdate: (clientId: string, changes: TodoDraftChanges) => void;
  onDraftCancel: (clientId: string) => void;
};

export const TodoTable = ({
  todos,
  todoDrafts,
  onDraftAdd,
  onDraftUpdate,
  onDraftCancel,
}: TodoTableProps) => {
  return (
    <table className="todo-table">
      <thead className="todo-table__header">
        <tr className="todo-table__header-row">
          <th className="todo-table__header-cell todo-table__header-cell--name">Name</th>
          <th className="todo-table__header-cell todo-table__header-cell--description">
            Description
          </th>
          <th className="todo-table__header-cell todo-table__header-cell--date">Created Date</th>
          <th className="todo-table__header-cell todo-table__header-cell--action">Action</th>
        </tr>
      </thead>
      <tbody className="todo-table__body">
        {/* Render drafts for adding todos*/}
        {todoDrafts
          .filter((draft) => draft.action === "add")
          .map((draft) => (
            <TodoTableDraftRow
              key={draft.clientId}
              draft={draft}
              onDraftUpdate={onDraftUpdate}
              onCancel={onDraftCancel}
            />
          ))}

        {/* Render drafts for updating/removing todos*/}
        {todos.map((todo: TodoDto) => {
          const draft = todoDrafts.find((draft) => draft.id === todo.id);

          if (draft) {
            return (
              <TodoTableDraftRow
                key={draft.clientId}
                draft={draft}
                onDraftUpdate={onDraftUpdate}
                onCancel={onDraftCancel}
              />
            );
          }

          return (
            <TodoTableRow
              key={todo.id}
              todo={todo}
              onEdit={() => onDraftAdd(todo, "update")}
              onRemove={() => onDraftAdd(todo, "remove")}
            />
          );
        })}
      </tbody>
    </table>
  );
};
