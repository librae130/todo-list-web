import { useCallback, useState } from "react";
import type { TodoDto } from "../dtos/TodoDto.tsx";
import type { TodoBatchOperationDraftDto } from "../dtos/TodoBatchDto.tsx";
import type { TodoBatchAction } from "../types/TodoBatchAction.tsx";
import type { TodoBatchOperationChanges } from "../types/TodoBatchOperationChanges.tsx";
import { TODO_BATCH_MAX_OPERATIONS } from "../constants/todo.tsx";

export const useTodoBatchOperations = () => {
  const [batchOperations, setBatchOperations] = useState<
    TodoBatchOperationDraftDto[]
  >([]);
  const hasPendingOperations = batchOperations.length > 0;

  const addOperation = useCallback(
    (todo: TodoDto | null, action: TodoBatchAction) => {
      if (batchOperations.length >= TODO_BATCH_MAX_OPERATIONS) {
        throw new RangeError(
          `A batch cannot contain more than ${TODO_BATCH_MAX_OPERATIONS} operations.`,
        );
      }

      const newOperation: TodoBatchOperationDraftDto = {
        clientId: crypto.randomUUID(),
        action,
        name: "",
        description: "",
      };

      if (todo !== null) {
        newOperation.todoId = todo.id;
        newOperation.createdAt = todo.createdAt;
        newOperation.name = todo.name;
        newOperation.description = todo.description;
      }

      setBatchOperations((operations) => [...operations, newOperation]);
    },
    [batchOperations],
  );

  const updateOperation = useCallback(
    (clientId: string, changes: TodoBatchOperationChanges) => {
      setBatchOperations((operations) =>
        operations.map((operation) => {
          if (operation.clientId !== clientId) {
            return operation;
          }

          return { ...operation, ...changes };
        }),
      );
    },
    [],
  );

  const removeOperation = useCallback((clientId: string) => {
    setBatchOperations((operations) =>
      operations.filter((operation) => operation.clientId !== clientId),
    );
  }, []);

  const clearOperations = useCallback(() => {
    setBatchOperations([]);
  }, []);

  return {
    batchOperations,
    hasPendingOperations,
    addOperation,
    updateOperation,
    removeOperation,
    clearOperations,
  };
};
