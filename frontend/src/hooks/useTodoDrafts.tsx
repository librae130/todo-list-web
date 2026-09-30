import { useCallback, useState } from "react";
import type { TodoDto } from "../dtos/TodoDto.tsx";
import type { TodoDraft, TodoDraftChanges } from "../types/TodoDraft.tsx";

export const useTodoDrafts = () => {
  const [todoDrafts, setTodoDrafts] = useState<TodoDraft[]>([]);
  const [isEditing, setIsEditing] = useState(false);

  const addDraft = useCallback((todo: TodoDto | null, action: TodoDraft["action"]) => {
    setTodoDrafts((drafts) => [
      ...drafts,
      {
        ...todo,
        clientId: crypto.randomUUID(),
        action,
        name: todo?.name ?? "",
        description: todo?.description ?? "",
      },
    ]);
    setIsEditing(true);
  }, []);

  const updateDraft = useCallback((clientId: string, changes: TodoDraftChanges) => {
    setTodoDrafts((drafts) =>
      drafts.map((draft) => (draft.clientId === clientId ? { ...draft, ...changes } : draft)),
    );
  }, []);

  const removeDraft = useCallback((clientId: string) => {
    setTodoDrafts((drafts) => drafts.filter((draft) => draft.clientId !== clientId));
  }, []);

  const resetDrafts = useCallback(() => {
    setTodoDrafts([]);
    setIsEditing(false);
  }, []);

  return { todoDrafts, isEditing, addDraft, updateDraft, removeDraft, resetDrafts };
};
