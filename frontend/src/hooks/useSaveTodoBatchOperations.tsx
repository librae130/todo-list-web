import { useCallback, useState } from "react";
import { TodoService } from "../services/TodoService.tsx";
import type { TodoDto } from "../dtos/TodoDto.tsx";
import type {
  TodoBatchOperationDraftDto,
  TodoBatchOperationRequestDto,
  TodoBatchRequestDto,
  TodoBatchOperationResultDto,
} from "../dtos/TodoBatchDto.tsx";
import { getErrorMessage } from "../utils/errorUtils.tsx";

interface UseSaveTodoBatchOperationsOptions {
  todos: TodoDto[];
  batchOperations: TodoBatchOperationDraftDto[];
  onBatchOperationSaved: (clientId: string) => void;
  onTodosChanged: () => void;
}

const findUnchangedOperations = (
  todos: TodoDto[],
  operations: TodoBatchOperationDraftDto[],
) => {
  return operations.filter((operation) => {
    if (operation.action !== "update" || !operation.todoId) {
      return false;
    }

    const todo = todos.find((item) => item.id === operation.todoId);
    return (
      todo?.name === operation.name &&
      todo.description === operation.description
    );
  });
};

const hasExpectedResult = (
  operation: TodoBatchOperationDraftDto,
  result: TodoBatchOperationResultDto | undefined,
) => {
  if (!result || !result.isSucceeded || result.action !== operation.action) {
    return false;
  }

  if (operation.action === "remove") {
    return result.todoId != null;
  }

  return result.todo != null;
};

const createFailureMessage = (
  failedOperations: TodoBatchOperationDraftDto[],
  resultsByClientId: Map<string, TodoBatchOperationResultDto>,
) => {
  const messages = new Set<string>();

  for (const operation of failedOperations) {
    const message = resultsByClientId.get(operation.clientId)?.errorMessage;
    if (message) {
      messages.add(message);
    }
  }

  const count = failedOperations.length;
  let summary = `${count} changes could not be saved.`;
  if (count === 1) {
    summary = "1 change could not be saved.";
  }

  if (messages.size > 0) {
    return `${summary} ${[...messages].join(" ")}`;
  }

  return `${summary} Review the remaining changes and try again.`;
};

const buildTodoBatchRequest = (
  operations: TodoBatchOperationDraftDto[],
): TodoBatchRequestDto => {
  const requestOperations: TodoBatchOperationRequestDto[] = [];

  for (const operation of operations) {
    if (operation.action === "add") {
      requestOperations.push({
        clientId: operation.clientId,
        action: operation.action,
        name: operation.name,
        description: operation.description,
      });
      continue;
    }

    if (!operation.todoId) {
      throw new Error("A to-do ID is required.");
    }

    if (operation.action === "remove") {
      requestOperations.push({
        clientId: operation.clientId,
        action: operation.action,
        todoId: operation.todoId,
      });
      continue;
    }

    requestOperations.push({
      clientId: operation.clientId,
      action: operation.action,
      todoId: operation.todoId,
      name: operation.name,
      description: operation.description,
    });
  }

  return { operations: requestOperations };
};

export const useSaveTodoBatchOperations = ({
  todos,
  batchOperations,
  onBatchOperationSaved,
  onTodosChanged,
}: UseSaveTodoBatchOperationsOptions) => {
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");

  const save = useCallback(async () => {
    setIsSaving(true);
    setError("");

    try {
      const invalidOperation = batchOperations.find(
        (operation) =>
          operation.action !== "remove" && operation.name.trim().length === 0,
      );

      if (invalidOperation) {
        setError("A to-do name is required.");
        return;
      }

      // Complete unchanged edits locally instead of sending them to the API
      const unchangedOperations = findUnchangedOperations(
        todos,
        batchOperations,
      );
      for (const operation of unchangedOperations) {
        onBatchOperationSaved(operation.clientId);
      }

      const unchangedIds = new Set(
        unchangedOperations.map((operation) => operation.clientId),
      );
      const operationsToSave = batchOperations.filter(
        (operation) => !unchangedIds.has(operation.clientId),
      );

      if (operationsToSave.length === 0) {
        return;
      }

      const request = buildTodoBatchRequest(operationsToSave);

      const results = await TodoService.applyBatch(request);
      const resultsByClientId = new Map(
        results.map((result) => [result.clientId, result]),
      );
      const successfulResults: TodoBatchOperationResultDto[] = [];
      const failedOperations: TodoBatchOperationDraftDto[] = [];

      // Batch operations can succeed or fail independently
      for (const operation of operationsToSave) {
        const result = resultsByClientId.get(operation.clientId);
        if (hasExpectedResult(operation, result) && result) {
          successfulResults.push(result);
        } else {
          failedOperations.push(operation);
        }
      }

      for (const result of successfulResults) {
        onBatchOperationSaved(result.clientId);
      }

      if (successfulResults.length > 0) {
        onTodosChanged();
      }

      if (failedOperations.length > 0) {
        setError(createFailureMessage(failedOperations, resultsByClientId));
      }
    } catch (error: unknown) {
      setError(getErrorMessage(error));
    } finally {
      setIsSaving(false);
    }
  }, [todos, batchOperations, onBatchOperationSaved, onTodosChanged]);

  return { save, isSaving, error };
};
