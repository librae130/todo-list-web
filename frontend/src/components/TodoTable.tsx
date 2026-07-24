import type { TodoDTO } from "../dtos/TodoDTO.tsx";

export const TodoTable = ({
  data,
  onEdit,
  onDelete,
}: {
  data: TodoDTO[];
  onEdit: any;
  onDelete: any;
}) => {
  const formatDateTime = (dateTime: string) => {
    return dateTime.substring(0, dateTime.lastIndexOf(":")).split("T").join(" ");
  };

  const handleEdit = (id: string) => () => {
    onEdit(true, id);
  };

  const handleDelete = (id: string) => () => {
    onDelete(id);
  };

  return (
    <table className="todo-table">
      <thead className="todo-table__header">
        <tr className="todo-table__header-row">
          <th className="todo-table__header-cell todo-table__header-cell--name">Name</th>
          <th className="todo-table__header-cell todo-table__header-cell--description">Description</th>
          <th className="todo-table__header-cell todo-table__header-cell--date">Created Date</th>
          <th className="todo-table__header-cell todo-table__header-cell--action">Action</th>
        </tr>
      </thead>
      <tbody className="todo-table__body">
        {data.map((todo: TodoDTO) => {
          return (
            <tr key={todo.id} className="todo-table__row">
              <td className="todo-table__cell todo-table__cell--name">{todo.name}</td>
              <td className="todo-table__cell todo-table__cell--description">{todo.description}</td>
              <td className="todo-table__cell todo-table__cell--date">{formatDateTime(todo.createdAt)}</td>
              <td className="todo-table__cell todo-table__cell--actions">
                <div className="todo-table__actions">
                  <button className="todo-table__action-button todo-table__action-button--edit" onClick={handleEdit(todo.id)}>
                    Edit
                  </button>
                  <button className="todo-table__action-button todo-table__action-button--delete" onClick={handleDelete(todo.id)}>
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};
