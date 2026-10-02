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
  if (draft.name.trim().length <= 0) return null;

  const newTodo: AddTodoDto = { name: draft.name, description: draft.description };
  const createdTodo = await TodoService.create(newTodo);
  return { ...createdTodo, createdAt: formatDateTime(createdTodo.createdAt) };
};

const saveUpdatedTodo = async (draft: TodoDraft) => {
  if (draft.name.trim().length <= 0) return null;

  if (!draft.id) {
    throw new Error("Unable to update a to-do item without an ID.");
  }

  const updatedTodo: UpdateTodoDto = {
    name: draft.name ?? "",
    description: draft.description ?? "",
  };
  const updatedTodoResponse = await TodoService.update(draft.id, updatedTodo);
  return { ...updatedTodoResponse, createdAt: formatDateTime(updatedTodoResponse.createdAt) };
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
  onSaved: () => void;
}

export const useSaveTodoDrafts = ({
  todos,
  setTodos,
  todoDrafts,
  onSaved,
}: UseSaveTodoDraftsOptions) => {
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");

  const save = useCallback(async () => {
    setIsSaving(true);
    setError("");

    try {
      let updatedTodos = [...todos];

      for (const draft of todoDrafts) {
        switch (draft.action) {
          case "add": {
            const createdTodo = await saveAddedTodo(draft);

            if (createdTodo !== null) {
              updatedTodos = [createdTodo, ...updatedTodos];
            }

            break;
          }
          case "update": {
            const updatedTodo = await saveUpdatedTodo(draft);

            if (updatedTodo !== null) {
              updatedTodos = updatedTodos.map((todo) =>
                todo.id === draft.id ? { ...todo, ...updatedTodo } : todo,
              );
            }

            break;
          }
          case "remove": {
            const removedId = await saveRemovedTodo(draft);
            updatedTodos = updatedTodos.filter((todo) => todo.id !== removedId);
            break;
          }
        }
      }

      setTodos(updatedTodos.toSorted(compareTodo));
      onSaved();
    } catch (error: unknown) {
      setError(getErrorMessage(error));
    } finally {
      setIsSaving(false);
    }
  }, [todos, setTodos, todoDrafts, onSaved]);

  return { save, isSaving, error };
};
