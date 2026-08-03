import { useState } from "react";
import type { UpdateTodoDTO } from "../dtos/UpdateTodoDTO.tsx";
import type { TodoDTO } from "../dtos/TodoDTO.tsx";

type TodoTableRowProps = {
  todo: TodoDTO;
  // onEdit: (editMode: boolean, id: string | null) => void;
  onClickEdit: (
    editingTodoId: string,
    updateTodoDTO: UpdateTodoDTO,
  ) => Promise<void>;
  onClickDelete: (id: string) => Promise<void>;
};

export const TodoTableRow = ({
  todo,
  onClickEdit,
  onClickDelete,
}: TodoTableRowProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(todo.name);
  const [editedDescription, setEditedDescription] = useState(todo.description);
  const [errors, setErrors] = useState<{ name?: string; description?: string }>(
    {},
  );
  const [isSaving, setIsSaving] = useState(false);

  const handleSaveEdit = async () => {
    if (editedName === todo.name && editedDescription === todo.description) {
      setIsEditing(false);
      return;
    }

    setErrors({});
    const newErrors: { name?: string; description?: string } = {};

    if (editedName.trim() === "") {
      newErrors.name = "Name can not be blank.";
    } else if (editedName.length > 100) {
      newErrors.name = "Name cannot be longer than 100 characters.";
    }

    if (editedDescription.length > 500) {
      newErrors.description =
        "Description cannot be longer than 500 characters.";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSaving(true);
    await onClickEdit(todo.id, {
      name: editedName,
      description: editedDescription,
    });
    setIsSaving(false);
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setEditedName(todo.name);
    setEditedDescription(todo.description);
    setIsEditing(false);
  };

  const handleDelete = async () => {
    await onClickDelete(todo.id);
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  if (isEditing) {
    return (
      <tr className="todo-table__row">
        <td className="todo-table__cell todo-table__cell--name">
          <textarea
            className="todo-table__textarea todo-table__textarea--name"
            value={editedName}
            name="name"
            maxLength={100}
            placeholder="Required"
            onChange={(e) => setEditedName(e.target.value)}
          />
          <div className="todo-table__footer">
            {errors.name && (
              <p className="todo-table__footer-error-message">{errors.name}</p>
            )}
            <p className="todo-table__footer-char-counter">
              {editedName.length}/100
            </p>
          </div>
        </td>
        <td className="todo-table__cell todo-table__cell--description">
          <textarea
            className="todo-table__textarea todo-table__textarea--description"
            value={editedDescription}
            name="description"
            placeholder="Optional"
            maxLength={500}
            onChange={(e) => setEditedDescription(e.target.value)}
          />
          <div className="todo-table__footer">
            {errors.description && (
              <p className="todo-table__footer-error-message">
                {errors.description}
              </p>
            )}
            <p className="todo-table__footer-char-counter">
              {editedDescription.length}/500
            </p>
          </div>
        </td>
        <td className="todo-table__cell todo-table__cell--date">
          {todo.createdAt}
        </td>
        <td className="todo-table__cell todo-table__cell--actions">
          <div className="todo-table__actions">
            <button
              className="todo-table__action-button todo-table__action-button--save-edit"
              disabled={isSaving}
              onClick={handleSaveEdit}
            >
              {isSaving ? "Saving..." : "Save Edit"}
            </button>
            <button
              className="todo-table__action-button todo-table__action-button--cancel-edit"
              disabled={isSaving}
              onClick={handleCancelEdit}
            >
              Cancel
            </button>
          </div>
        </td>
      </tr>
    );
  } else {
    return (
      <tr className="todo-table__row">
        <td className="todo-table__cell todo-table__cell--name">{todo.name}</td>
        <td className="todo-table__cell todo-table__cell--description">
          {todo.description}
        </td>
        <td className="todo-table__cell todo-table__cell--date">
          {todo.createdAt}
        </td>
        <td className="todo-table__cell todo-table__cell--actions">
          <div className="todo-table__actions">
            <button
              className="todo-table__action-button todo-table__action-button--edit"
              onClick={handleEdit}
            >
              Edit
            </button>
            <button
              className="todo-table__action-button todo-table__action-button--delete"
              onClick={handleDelete}
            >
              Delete
            </button>
          </div>
        </td>
      </tr>
    );
  }
};
