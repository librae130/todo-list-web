import { useRef, useLayoutEffect } from "react";
import type { TodoBatchOperationDraftDto } from "../../dtos/TodoBatchDto.tsx";
import type { TodoBatchOperationChanges } from "../../types/TodoBatchOperationChanges.tsx";
import { TODO_RESTRAINTS } from "../../constants/todo.tsx";

type TodoTableBatchOperationRowProps = {
  isLoading: boolean;
  operation: TodoBatchOperationDraftDto;
  onOperationUpdate: (
    clientId: string,
    changes: TodoBatchOperationChanges,
  ) => void;
  onCancel: (clientId: string) => void;
};

export const TodoTableBatchOperationRow = ({
  isLoading,
  operation,
  onOperationUpdate,
  onCancel,
}: TodoTableBatchOperationRowProps) => {
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
  }, [operation.name, operation.description]);

  if (operation.action === "remove") {
    return (
      <tr className="todo-table__row todo-table__batch-operation-row todo-table__row--remove">
        <td className="todo-table__cell todo-table__cell--name">
          {operation.name}
        </td>
        <td className="todo-table__cell todo-table__cell--description">
          {operation.description}
        </td>
        <td className="todo-table__cell todo-table__cell--date">
          {operation.createdAt ?? "-"}
        </td>
        <td className="todo-table__cell todo-table__cell--action">
          <div className="todo-table__action">
            <button
              className="todo-table__action-button todo-table__action-button--cancel"
              type="button"
              disabled={isLoading}
              onClick={() => onCancel(operation.clientId)}
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
      className={`todo-table__row todo-table__batch-operation-row todo-table__row--${operation.action}`}
    >
      <td className="todo-table__cell todo-table__cell--name">
        <textarea
          className="todo-table__textarea todo-table__textarea--name"
          value={operation.name}
          name="name"
          placeholder="Required"
          maxLength={TODO_RESTRAINTS.NAME_MAX_LENGTH}
          disabled={isLoading}
          onChange={(event) =>
            onOperationUpdate(operation.clientId, { name: event.target.value })
          }
          ref={nameInputRef}
        />
        <div className="todo-table__footer">
          <p className="todo-table__footer-char-counter">
            {operation.name.length}/{TODO_RESTRAINTS.NAME_MAX_LENGTH}
          </p>
        </div>
      </td>
      <td className="todo-table__cell todo-table__cell--description">
        <textarea
          className="todo-table__textarea todo-table__textarea--description"
          value={operation.description}
          name="description"
          placeholder="Optional"
          maxLength={TODO_RESTRAINTS.DESCRIPTION_MAX_LENGTH}
          disabled={isLoading}
          onChange={(event) =>
            onOperationUpdate(operation.clientId, {
              description: event.target.value,
            })
          }
          ref={descriptionInputRef}
        />
        <div className="todo-table__footer">
          <p className="todo-table__footer-char-counter">
            {operation.description.length}/
            {TODO_RESTRAINTS.DESCRIPTION_MAX_LENGTH}
          </p>
        </div>
      </td>
      <td className="todo-table__cell todo-table__cell--date">
        {operation.createdAt ?? "-"}
      </td>
      <td className="todo-table__cell todo-table__cell--action">
        <div className="todo-table__action">
          <button
            className="todo-table__action-button todo-table__action-button--cancel"
            type="button"
            disabled={isLoading}
            onClick={() => onCancel(operation.clientId)}
          >
            Cancel
          </button>
        </div>
      </td>
    </tr>
  );
};
