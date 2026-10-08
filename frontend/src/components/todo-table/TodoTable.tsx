import type { TodoDto } from "../../dtos/TodoDto.tsx";
import { TodoTableRow } from "./TodoTableRow.tsx";
import type { TodoDraft, TodoDraftChanges } from "../../types/TodoDraft.tsx";
import { TodoTableDraftRow } from "./TodoTableDraftRow.tsx";

type TodoTableProps = {
  isLoading: boolean;
  todos: TodoDto[];
  todoDrafts: TodoDraft[];
  onDraftAdd: (todo: TodoDto | null, action: TodoDraft["action"]) => void;
  onDraftUpdate: (clientId: string, changes: TodoDraftChanges) => void;
  onDraftCancel: (clientId: string) => void;
};

export const TodoTable = ({
  isLoading,
  todos,
  todoDrafts,
  onDraftAdd,
  onDraftUpdate,
  onDraftCancel,
}: TodoTableProps) => {
  const addDrafts: TodoDraft[] = [];
  const draftsByTodoId = new Map<string, TodoDraft>();

  for (const draft of todoDrafts) {
    if (draft.action === "add") {
      addDrafts.push(draft);
    } else if (draft.id !== undefined && !draftsByTodoId.has(draft.id)) {
      draftsByTodoId.set(draft.id, draft);
    }
  }

  return (
    <table className="todo-table">
      <tbody className="todo-table__body">
        {/* Render drafts for adding todos*/}
        {addDrafts.map((draft) => (
          <TodoTableDraftRow
            key={draft.clientId}
            isLoading={isLoading}
            draft={draft}
            onDraftUpdate={onDraftUpdate}
            onCancel={onDraftCancel}
          />
        ))}

        {/* Render drafts for updating/removing todos*/}
        {todos.map((todo: TodoDto) => {
          const draft = draftsByTodoId.get(todo.id);

          if (draft) {
            return (
              <TodoTableDraftRow
                key={draft.clientId}
                isLoading={isLoading}
                draft={draft}
                onDraftUpdate={onDraftUpdate}
                onCancel={onDraftCancel}
              />
            );
          }

          return (
            <TodoTableRow
              key={todo.id}
              isLoading={isLoading}
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
