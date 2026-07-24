import { useEffect, useState } from "react";
import type { TodoDTO } from "../dtos/TodoDTO.tsx";

export const EditTodoModal = ({
  todo,
  onSave,
  onClose,
}: {
  todo: TodoDTO;
  onSave: any;
  onClose: any;
}) => {
  const [isSaving, setIsSaving] = useState(false);
  const [name, setName] = useState(todo.name);
  const [description, setDescription] = useState(todo.description);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setName(todo.name);
    setDescription(todo.description);
    setError(null);
  }, [todo]);

  function handleSave(event: any) {
    event.preventDefault();

    if (name.trim() === "") {
      setError("Name can not be blank.");
      return;
    }

    setIsSaving(true);

    onSave({ name: name.trim(), description });

    setIsSaving(false);
  }

  const handleClose = () => {
    if (isSaving === false) {
      onClose(false, null);
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
            onChange={(event) => setName(event.target.value)}
          />
          <label className="modal__label">Edit Description:</label>
          <textarea
            className="modal__textarea modal__textarea--description"
            name="description"
            value={description}
            onChange={(event) => setDescription(event.target.value)}
          />
          {error && <p className="modal__error-message">{error}</p>}
          <button className="modal__submit-button" type="submit" disabled={isSaving}>
            {isSaving ? "Saving..." : "Save"}
          </button>
        </form>
      </div>
    </div>
  );
};
