import { useState } from "react";
import type { RefObject } from "react";
import type { CreateTodoDTO } from "../dtos/CreateTodoDTO.tsx";

type NewTodoTableRowProps = {
  // onEdit: (editMode: boolean, id: string | null) => void;
  onClickCreateAsync: (newTodo: CreateTodoDTO) => Promise<void>;
  onCloseCreateRow: () => void;
  ref: RefObject<HTMLTableRowElement | null>;
};

export const NewTodoTableRow = ({
  onClickCreateAsync,
  onCloseCreateRow,
  ref,
}: NewTodoTableRowProps) => {
  const [newName, setNewName] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [validationErrors, setValidationErrors] = useState<{
    name?: string;
    description?: string;
  }>({});
  const [isSaving, setIsSaving] = useState(false);

  const handleCreate = async () => {
    setValidationErrors({});
    const newErrors: { name?: string; description?: string } = {};

    if (newName.trim() === "") {
      newErrors.name = "Name can not be blank.";
    } else if (newName.length > 100) {
      newErrors.name = "Name cannot be longer than 100 characters.";
    }

    if (newDescription.length > 500) {
      newErrors.description =
        "Description cannot be longer than 500 characters.";
    }

    if (Object.keys(newErrors).length > 0) {
      setValidationErrors(newErrors);
      return;
    }

    setIsSaving(true);
    await onClickCreateAsync({
      name: newName,
      description: newDescription,
    });
    onCloseCreateRow();
    setIsSaving(false);
  };

  return (
    <tr ref={ref} className="todo-table__row todo-table__row--create">
      <td className="todo-table__cell todo-table__cell--name">
        <textarea
          className="todo-table__textarea todo-table__textarea--name"
          value={newName}
          name="name"
          placeholder="Required"
          maxLength={100}
          onChange={(e) => setNewName(e.target.value)}
        />
        <div className="todo-table__footer">
          {validationErrors.name && (
            <p className="todo-table__footer-error-message">
              {validationErrors.name}
            </p>
          )}
          <p className="todo-table__footer-char-counter">
            {newName.length}/100
          </p>
        </div>
      </td>
      <td className="todo-table__cell todo-table__cell--description">
        <textarea
          className="todo-table__textarea todo-table__textarea--description"
          value={newDescription}
          name="description"
          placeholder="Optional"
          maxLength={500}
          onChange={(e) => setNewDescription(e.target.value)}
        />
        <div className="todo-table__footer">
          {validationErrors.description && (
            <p className="todo-table__footer-error-message">
              {validationErrors.description}
            </p>
          )}
          <p className="todo-table__footer-char-counter">
            {newDescription.length}/500
          </p>
        </div>
      </td>
      <td className="todo-table__cell todo-table__cell--date"></td>
      <td className="todo-table__cell todo-table__cell--actions">
        <div className="todo-table__actions">
          <button
            className="todo-table__action-button todo-table__action-button--create"
            disabled={isSaving}
            onClick={handleCreate}
          >
            {isSaving ? "Saving..." : "Create"}
          </button>
          <button
            className="todo-table__action-button todo-table__action-button--cancel-create"
            disabled={isSaving}
            onClick={onCloseCreateRow}
          >
            Cancel
          </button>
        </div>
      </td>
    </tr>
  );
};
