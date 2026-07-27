import { useState } from "react";
import type { CreateTodoDTO } from "../dtos/CreateTodoDTO.tsx";

type CreateTodoModalProps = {
  onCreate: (newTodo: CreateTodoDTO) => void;
  onClose: (open: boolean) => void;
};

export const CreateTodoModal = ({ onCreate, onClose }: CreateTodoModalProps) => {
  const [isCreating, setIsCreating] = useState(false);
  const [errors, setErrors] = useState<{ name?: string; description?: string }>({});
  const [nameLength, setNameLength] = useState(0);
  const [descriptionLength, setDescriptionLength] = useState(0);

  const handleCreate = (event: any) => {
    event.preventDefault();
    setErrors({});
    const formData = new FormData(event.currentTarget);

    const name = String(formData.get("name") ?? "");
    const description = String(formData.get("description") ?? "");

    const newErrors: { name?: string; description?: string } = {};

    if (name.trim() === "") {
      newErrors.name = "Name can not be blank.";
    } else if (name.length > 100) {
      newErrors.name = "Name cannot be longer than 100 characters.";
    }

    if (description.length > 500) {
      newErrors.description = "Description cannot be longer than 500 characters.";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsCreating(true);

    onCreate({ name, description });

    setIsCreating(false);
  };

  const handleClose = () => {
    if (isCreating === false) {
      onClose(false);
    }
  };

  return (
    <div className="modal modal--create-todo">
      <div className="modal__content">
        <span className="modal__close-button" onClick={handleClose}>
          &times;
        </span>
        <form
          className="modal__form modal__form--create"
          onSubmit={handleCreate}
        >
          <label className="modal__label">Name:</label>
          <input
            className="modal__input modal__input--name"
            name="name"
            type="text"
            maxLength={100}
            onChange={(e) => setNameLength(e.target.value.length)}
          />
          <div className="modal__input__footer">
            {errors.name && (
              <p className="modal__error-message">{errors.name}</p>
            )}
            <p className="modal__char-counter">{nameLength}/100</p>
          </div>
          <label className="modal__label">Description:</label>
          <textarea
            className="modal__textarea modal__textarea--description"
            name="description"
            maxLength={500}
            onChange={(e) => setDescriptionLength(e.target.value.length)}
          />
          <div className="modal__input__footer">
            {errors.description && (
              <p className="modal__error-message">{errors.description}</p>
            )}
            <p className="modal__char-counter">{descriptionLength}/500</p>
          </div>
          <button
            className="modal__submit-button"
            type="submit"
            disabled={isCreating}
          >
            {isCreating ? "Creating..." : "Create"}
          </button>
        </form>
      </div>
    </div>
  );
};
