import type { TodoDto } from "../../dtos/TodoDto.tsx";
import { TodoTableRow } from "./TodoTableRow.tsx";
import type { TodoBatchOperationDraftDto } from "../../dtos/TodoBatchDto.tsx";
import type { TodoBatchAction } from "../../types/TodoBatchAction.tsx";
import type { TodoBatchOperationChanges } from "../../types/TodoBatchOperationChanges.tsx";
import { TodoTableBatchOperationRow } from "./TodoTableBatchOperationRow.tsx";

type TodoTableProps = {
  isLoading: boolean;
  todos: TodoDto[];
  batchOperations: TodoBatchOperationDraftDto[];
  onBatchOperationAdd: (todo: TodoDto | null, action: TodoBatchAction) => void;
  onBatchOperationUpdate: (clientId: string, changes: TodoBatchOperationChanges) => void;
  onBatchOperationCancel: (clientId: string) => void;
};

export const TodoTable = ({
  isLoading,
  todos,
  batchOperations,
  onBatchOperationAdd,
  onBatchOperationUpdate,
  onBatchOperationCancel,
}: TodoTableProps) => {
  const operationsByTodoId = new Map<string, TodoBatchOperationDraftDto>();

  for (const operation of batchOperations) {
    if (
      operation.action !== "add" &&
      operation.todoId !== undefined &&
      !operationsByTodoId.has(operation.todoId)
    ) {
      operationsByTodoId.set(operation.todoId, operation);
    }
  }

  const additionalOperations = batchOperations.filter((operation) => operation.action === "add");

  const renderedOperationIds = new Set<string>();
  for (const todo of todos) {
    const operation = operationsByTodoId.get(todo.id);
    if (operation) {
      renderedOperationIds.add(operation.clientId);
    }
  }

  const remainingOperations = batchOperations.filter(
    (operation) => operation.action !== "add" && !renderedOperationIds.has(operation.clientId),
  );

  return (
    <table className="todo-table">
      <tbody className="todo-table__body">
        {/* Keep new rows at the top of the table. */}
        {additionalOperations.map((operation) => (
          <TodoTableBatchOperationRow
            key={operation.clientId}
            isLoading={isLoading}
            operation={operation}
            onOperationUpdate={onBatchOperationUpdate}
            onCancel={onBatchOperationCancel}
          />
        ))}

        {/* Replace matching todos with their pending operation. */}
        {todos.map((todo: TodoDto) => {
          const operation = operationsByTodoId.get(todo.id);

          if (operation) {
            return (
              <TodoTableBatchOperationRow
                key={operation.clientId}
                isLoading={isLoading}
                operation={operation}
                onOperationUpdate={onBatchOperationUpdate}
                onCancel={onBatchOperationCancel}
              />
            );
          }

          return (
            <TodoTableRow
              key={todo.id}
              isLoading={isLoading}
              todo={todo}
              onEdit={() => onBatchOperationAdd(todo, "update")}
              onRemove={() => onBatchOperationAdd(todo, "remove")}
            />
          );
        })}

        {/* Render update/removal operations hidden by the active filter. */}
        {remainingOperations.map((operation) => (
          <TodoTableBatchOperationRow
            key={operation.clientId}
            isLoading={isLoading}
            operation={operation}
            onOperationUpdate={onBatchOperationUpdate}
            onCancel={onBatchOperationCancel}
          />
        ))}
      </tbody>
    </table>
  );
};
