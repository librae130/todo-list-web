import type { TodoDto } from "../../dtos/TodoDto.tsx";
import { TodoTableRow } from "./TodoTableRow.tsx";
import type { TodoDraft } from "../../types/TodoDraft.tsx";
import { TodoTableDraftRow } from "./TodoTableDraftRow.tsx";

type TodoTableProps = {
  todos: TodoDto[];
  todoDrafts: TodoDraft[];
  onRemoveRow: (todo: TodoDto, action: TodoDraft["action"]) => void;
};

export const TodoTable = ({
  todos,
  todoDrafts,
  onRemoveRow,
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
        {todoDrafts.map((draft: TodoDraft) => {
          switch (draft.action) {
            case "add": {
              return (
                <TodoTableDraftRow
                  key={draft.clientId}
                  draft={draft}
                  isUpdating={true}
                />
              );
            }
            case "update": {
              return (
                <TodoTableDraftRow
                  key={draft.clientId}
                  draft={draft}
                  isUpdating={true}
                />
              );
            }
            case "remove": {
              return (
                <TodoTableDraftRow
                  key={draft.clientId}
                  draft={draft}
                  isRemoving={true}
                />
              );
            }
          }
        })}

        {todos.map((todo: TodoDto) => {
          const draft = todoDrafts.find((draft) => draft.id === todo.id);

          if (!draft) {
            return (
              <TodoTableRow
                key={todo.id}
                todo={todo}
                onEdit={() => {}}
                onRemove={onRemoveRow}
              />
            );
          }
        })}
      </tbody>
    </table>
  );
};
