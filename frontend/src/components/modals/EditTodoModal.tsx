import { useState } from "react";
import type { TodoDto } from "../../dtos/TodoDto.tsx";
import type { UpdateTodoDto } from "../../dtos/UpdateTodoDto.tsx";

type EditTodoModalProps = {
  todo: TodoDto;
  onSaveAsync: (updatedTodo: UpdateTodoDto) => Promise<void>;
  onClose: () => void;
};

export const EditTodoModal = ({
  todo,
  onSaveAsync,
  onClose,
}: EditTodoModalProps) => {
  const [isSaving, setIsSaving] = useState(false);
  const [name, setName] = useState(todo.name);
  const [description, setDescription] = useState(todo.description);
  const [validationErrors, setValidationErrors] = useState<{
    name?: string;
    description?: string;
  }>({});

  const handleSave = async (event: any) => {
    event.preventDefault();
    setValidationErrors({});
    const newErrors: { name?: string; description?: string } = {};

    if (name.trim() === "") {
      newErrors.name = "Name can not be blank.";
    } else if (name.length > 100) {
      newErrors.name = "Name cannot be longer than 100 characters.";
    }

    if (description.length > 500) {
      newErrors.description =
        "Description cannot be longer than 500 characters.";
    }

    if (Object.keys(newErrors).length > 0) {
      setValidationErrors(newErrors);
      return;
    }

    setIsSaving(true);
    await onSaveAsync({ name: name, description });
    setIsSaving(false);
    onClose();
  };

  const handleClose = () => {
    if (isSaving === false) {
      onClose();
    }
  };

  return (
    <div className="modal modal--edit-todo">
      <div className="modal__content">
        <span className="modal__close-button" onClick={handleClose}>
          &times;
        </span>
        <form className="modal__form modal__form--edit" onSubmit={handleSave}>
          <label className="modal__label">Edit Name:</label>
          <input
            className="modal__input modal__input--name"
            name="name"
            type="text"
            value={name}
            maxLength={100}
            onChange={(event) => setName(event.target.value)}
          />
          <div className="modal__input-footer">
            {validationErrors.name && (
              <p className="modal__input-footer-error-message">
                {validationErrors.name}
              </p>
            )}
            <p className="modal__input-footer-char-counter">
              {name.length}/100
            </p>
          </div>
          <label className="modal__label">Edit Description:</label>
          <textarea
            className="modal__textarea modal__textarea--description"
            name="description"
            value={description}
            maxLength={500}
            onChange={(event) => setDescription(event.target.value)}
          />
          <div className="modal__input-footer">
            {validationErrors.description && (
              <p className="modal__input-footer-error-message">
                {validationErrors.description}
              </p>
            )}
            <p className="modal__input-footer-char-counter">
              {description.length}/500
            </p>
          </div>
          <button
            className="modal__submit-button"
            type="submit"
            disabled={isSaving}
          >
            {isSaving ? "Saving..." : "Save"}
          </button>
        </form>
      </div>
    </div>
  );
};
