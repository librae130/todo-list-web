import { useState, useRef, useLayoutEffect } from "react";
import type { TodoDraft, TodoDraftChanges } from "../../types/TodoDraft.tsx";
import { TODO_RESTRAINTS } from "../../constants/todo.tsx";

type TodoTableDraftRowProps = {
  isLoading: boolean;
  draft: TodoDraft;
  onDraftUpdate: (clientId: string, changes: TodoDraftChanges) => void;
  onCancel: (clientId: string) => void;
};

export const TodoTableDraftRow = ({
  isLoading,
  draft,
  onDraftUpdate,
  onCancel,
}: TodoTableDraftRowProps) => {
  const [name, setName] = useState(draft.name ?? "");
  const [description, setDescription] = useState(draft.description ?? "");

  const nameInputRef = useRef<HTMLTextAreaElement>(null);
  const descriptionInputRef = useRef<HTMLTextAreaElement>(null);

  useLayoutEffect(() => {
    const textareas = [
      nameInputRef.current,
      descriptionInputRef.current,
    ].filter((textarea) => textarea !== null);

    textareas.forEach((textarea) => {
      textarea.style.height = "auto";
    });

    const sharedHeight = Math.max(
      ...textareas.map((textarea) => textarea.scrollHeight),
    );
    textareas.forEach((textarea) => {
      textarea.style.height = `${sharedHeight}px`;
    });
  }, [name, description]);

  const handleNameChange = (value: string) => {
    setName(value);
    onDraftUpdate(draft.clientId, { name: value });
  };

  const handleDescriptionChange = (value: string) => {
    setDescription(value);
    onDraftUpdate(draft.clientId, { description: value });
  };

  if (draft.action === "remove") {
    return (
      <tr className="todo-table__row todo-table__draft-row todo-table__row--remove">
        <td className="todo-table__cell todo-table__cell--name">
          {draft.name}
        </td>
        <td className="todo-table__cell todo-table__cell--description">
          {draft.description}
        </td>
        <td className="todo-table__cell todo-table__cell--date">
          {draft.createdAt}
        </td>
        <td className="todo-table__cell todo-table__cell--action">
          <div className="todo-table__action">
            <button
              className="todo-table__action-button todo-table__action-button--cancel"
              type="button"
              disabled={isLoading}
              onClick={() => onCancel(draft.clientId)}
            >
              Cancel
            </button>
          </div>
        </td>
      </tr>
    );
  }

  return (
    <tr
      className={`todo-table__row todo-table__draft-row todo-table__row--${draft.action}`}
    >
      <td className="todo-table__cell todo-table__cell--name">
        <textarea
          className="todo-table__textarea todo-table__textarea--name"
          value={name}
          name="name"
          placeholder="Required"
          maxLength={TODO_RESTRAINTS.NAME_MAX_LENGTH}
          onChange={(event) => handleNameChange(event.target.value)}
          ref={nameInputRef}
        />
        <div className="todo-table__footer">
          <p className="todo-table__footer-char-counter">
            {name.length}/{TODO_RESTRAINTS.NAME_MAX_LENGTH}
          </p>
        </div>
      </td>
      <td className="todo-table__cell todo-table__cell--description">
        <textarea
          className="todo-table__textarea todo-table__textarea--description"
          value={description}
          name="description"
          placeholder="Optional"
          maxLength={TODO_RESTRAINTS.DESCRIPTION_MAX_LENGTH}
          onChange={(event) => handleDescriptionChange(event.target.value)}
          ref={descriptionInputRef}
        />
        <div className="todo-table__footer">
          <p className="todo-table__footer-char-counter">
            {description.length}/{TODO_RESTRAINTS.DESCRIPTION_MAX_LENGTH}
          </p>
        </div>
      </td>
      <td className="todo-table__cell todo-table__cell--date">
        {draft.createdAt ?? "-"}
      </td>
      <td className="todo-table__cell todo-table__cell--action">
        <div className="todo-table__action">
          <button
            className="todo-table__action-button todo-table__action-button--cancel"
            type="button"
            disabled={isLoading}
            onClick={() => onCancel(draft.clientId)}
          >
            Cancel
          </button>
        </div>
      </td>
    </tr>
  );
};
