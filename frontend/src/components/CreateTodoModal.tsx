import { useState } from "react";
import type { CreateTodoDTO } from "../dtos/CreateTodoDTO.tsx";

type CreateTodoModalProps = {
  onCreate: (newTodo: CreateTodoDTO) => void;
  onClose: (open: boolean) => void;
};

export const CreateTodoModal = ({ onCreate, onClose }: CreateTodoModalProps) => {
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCreate = (event: any) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);

    const newTodo: CreateTodoDTO = {
      name: String(formData.get("name") ?? ""),
      description: String(formData.get("description") ?? ""),
      createdAt: new Date().toISOString(),
    };

    if (newTodo.name.trim() === "") {
      setError("Name can not be blank.");
      setIsCreating(false);
      return;
    }

    setIsCreating(true);

    onCreate(newTodo);

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
        <form className="modal__form modal__form--create" onSubmit={handleCreate}>
          <label className="modal__label">Name:</label>
          <input className="modal__input modal__input--name" name="name" type="text" />
          <label className="modal__label">Description:</label>
          <textarea className="modal__textarea modal__textarea--description" name="description" />
          {error && <p className="modal__error-message">{error}</p>}
          <button className="modal__submit-button" type="submit" disabled={isCreating}>
            {isCreating ? "Creating..." : "Create"}
          </button>
        </form>
      </div>
    </div>
  );
};
