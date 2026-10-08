import { useCallback, useState } from "react";
import type { Dispatch, SetStateAction } from "react";
import { TodoService } from "../services/TodoService.tsx";
import type { TodoDto } from "../dtos/TodoDto.tsx";
import type { AddTodoDto } from "../dtos/AddTodoDto.tsx";
import type { UpdateTodoDto } from "../dtos/UpdateTodoDto.tsx";
import type { TodoDraft } from "../types/TodoDraft.tsx";
import { formatDateTime } from "../utils/stringUtils.tsx";
import { getErrorMessage } from "../utils/errorUtils.tsx";
import { compareTodo } from "../utils/todoUtils.tsx";

const saveAddedTodo = async (draft: TodoDraft) => {
  if (draft.name.trim().length <= 0) {
    return null;
  }

  const newTodo: AddTodoDto = {
    name: draft.name,
    description: draft.description,
  };
  const createdTodo = await TodoService.create(newTodo);
  return { ...createdTodo, createdAt: formatDateTime(createdTodo.createdAt) };
};

const saveUpdatedTodo = async (todos: TodoDto[], draft: TodoDraft) => {
  if (draft.name.trim().length <= 0) {
    return null;
  }

  if (!draft.id) {
    throw new Error("Unable to update a to-do item without an ID.");
  }

  const originalTodo = todos.find((todo) => todo.id === draft.id);

  if (
    originalTodo &&
    originalTodo.name === draft.name &&
    originalTodo.description === draft.description
  ) {
    return null;
  }

  const updatedTodo: UpdateTodoDto = {
    name: draft.name ?? "",
    description: draft.description ?? "",
  };
  const updatedTodoResponse = await TodoService.update(draft.id, updatedTodo);
  return {
    ...updatedTodoResponse,
    createdAt: formatDateTime(updatedTodoResponse.createdAt),
  };
};

const saveRemovedTodo = async (draft: TodoDraft) => {
  if (!draft.id) {
    throw new Error("Unable to remove a to-do item without an ID.");
  }

  await TodoService.remove(draft.id);
  return draft.id;
};

interface UseSaveTodoDraftsOptions {
  todos: TodoDto[];
  setTodos: Dispatch<SetStateAction<TodoDto[]>>;
  todoDrafts: TodoDraft[];
  onDraftSaved: (clientId: string) => void;
}

export const useSaveTodoDrafts = ({
  todos,
  setTodos,
  todoDrafts,
  onDraftSaved,
}: UseSaveTodoDraftsOptions) => {
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");

  const save = useCallback(async () => {
    setIsSaving(true);
    setError("");

    try {
      const invalidDraft = todoDrafts.find(
        (draft) => draft.action !== "remove" && draft.name.trim().length <= 0,
      );

      if (invalidDraft) {
        setError("A to-do name is required.");
        return;
      }

      for (const draft of todoDrafts) {
        switch (draft.action) {
          case "add": {
            const createdTodo = await saveAddedTodo(draft);

            if (createdTodo !== null) {
              setTodos((currentTodos) =>
                [createdTodo, ...currentTodos].toSorted(compareTodo),
              );
            }

            break;
          }
          case "update": {
            const updatedTodo = await saveUpdatedTodo(todos, draft);

            if (updatedTodo !== null) {
              setTodos((currentTodos) =>
                currentTodos
                  .map((todo) =>
                    todo.id === draft.id ? { ...todo, ...updatedTodo } : todo,
                  )
                  .toSorted(compareTodo),
              );
            }

            break;
          }
          case "remove": {
            const removedId = await saveRemovedTodo(draft);
            setTodos((currentTodos) =>
              currentTodos
                .filter((todo) => todo.id !== removedId)
                .toSorted(compareTodo),
            );
            break;
          }
        }

        onDraftSaved(draft.clientId);
      }
    } catch (error: unknown) {
      setError(getErrorMessage(error));
    } finally {
      setIsSaving(false);
    }
  }, [todos, setTodos, todoDrafts, onDraftSaved]);

  return { save, isSaving, error };
};
