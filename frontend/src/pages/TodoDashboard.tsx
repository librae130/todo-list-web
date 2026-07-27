import { useState, useEffect } from "react";
import { api } from "../utils/api.tsx";
import axios from "axios";
import type { TodoDTO } from "../dtos/TodoDTO.tsx";
import type { UpdateTodoDTO } from "../dtos/UpdateTodoDTO.tsx";
import type { CreateTodoDTO } from "../dtos/CreateTodoDTO.tsx";
import type { TodoFilterOption } from "../components/TodoFilterSelect.tsx";
import { TodoTable } from "../components/TodoTable.tsx";
import { TodoDashboardControls } from "../components/TodoDashboardControls.tsx";
import { EditTodoModal } from "../components/EditTodoModal.tsx";
import { CreateTodoModal } from "../components/CreateTodoModal.tsx";

// Translates different error types (Axios, network, custom) into a user-friendly message.
const buildRequestErrorMessage = (err: any, action: string) => {
  // Ignore aborted requests, as these are intentional and not true errors.
  if (axios.isCancel(err)) {
    return null;
  }

  if (axios.isAxiosError(err)) {
    if (err.code === "ECONNABORTED" || err.code === "ETIMEDOUT") {
      return `Request failed to send when ${action}.`;
    }

    if (err.code === "ERR_NETWORK") {
      return `Network error: No response from server when ${action}.`;
    }

    if (err.response) {
      if (err.response.status === 404) {
        return `404: ${err.response.data} when ${action}.`;
      }

      return `Server error: ${err.response.status} when ${action}.`;
    }

    return `Request failed to send when ${action}.`;
  }

  // Handle custom error messages thrown within the application logic.
  if (err instanceof Error) {
    if (err.message === "ERR_MALFORMED_DATA") {
      return `Unexpected data received from the server when ${action}.`;
    }

    if (err.message === "ERR_INVALID_PARAM") {
      return `Invalid params passed when ${action}.`;
    }
  }

  return `Unknown error when ${action}.`;
};

export const TodoDashboard = () => {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [tableData, setTableData] = useState<TodoDTO[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<TodoFilterOption>("all");
  const [isEditing, setIsEditing] = useState(false);
  const [editingTodoId, setEditingTodoId] = useState<string | null>(null);
  const [editingTodo, setEditingTodo] = useState<TodoDTO | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  // This effect hook is responsible for fetching the to-do list data whenever the search query or filter type changes.
  useEffect(() => {
    const abortController = new AbortController();

    const fetchTableData = async () => {
      setLoading(true);
      try {
        const response = await api.get("/api/todo-list/search", {
          signal: abortController.signal,
          params: {
            search: searchQuery ?? "",
            filter: filterType,
          },
        });

        const todosData = response.data ?? [];
        setError(null);
        setTableData(todosData);
      } catch (err: any) {
        setError(buildRequestErrorMessage(err, "fetching to-do table"));
      } finally {
        setLoading(false);
      }
    };

    fetchTableData();

    return () => abortController.abort();
  }, [searchQuery, filterType]);

  // Manages the state for the editing modal.
  const setEditMode = (editMode: boolean, id: string | null) => {
    setIsEditing(editMode);
    setEditingTodoId(id);

    // When entering edit mode, find the corresponding to-do from the table data
    // to populate the modal. When exiting, clear the editing state.
    if (editMode && id != null) {
      setEditingTodo(tableData.find((todo) => todo.id === id) ?? null);
    } else {
      setEditingTodo(null);
    }
  };

  const editTodo = async (updatedTodo: UpdateTodoDTO) => {
    if (editingTodoId == null) {
      return;
    }

    try {
      const response = await api.put(`/api/todo-list/${editingTodoId}`, updatedTodo);
      if (response.data != null) {
        // After a successful API call, update the specific item in the local tableData state.
        setTableData(
          tableData.map((todo) => {
            if (todo.id === editingTodoId) {
              return {
                ...todo,
                name: response.data.name,
                description: response.data.description,
              };
            }
            return todo;
          }),
        );
      } else {
        // If the server response is malformed, throw an error to be handled by the catch block.
        throw new Error("ERR_MALFORMED_DATA");
      }
    } catch (err: any) {
      const message = buildRequestErrorMessage(err, "editing to-do");
      if (message) {
        setError(message);
      }
    } finally {
      setLoading(false);
      setEditMode(false, null);
    }
  };

  const deleteTodo = async (id: string) => {
    setLoading(true);
    try {
      setTableData(tableData.filter((todo) => todo.id !== id));
      await api.delete(`/api/todo-list/${id}`);
    } catch (err: any) {
      setError(buildRequestErrorMessage(err, "deleting to-do"));
    } finally {
      setLoading(false);
    }
  };

  // Manages the state for the creating modal.
  const setCreateMode = (createMode: boolean) => {
    setIsCreating(createMode);
  };

  const createTodo = async (newTodo: CreateTodoDTO) => {
    try {
      const response = await api.post(`/api/todo-list`, newTodo);
      if (response.data != null) {
        setTableData([response.data, ...tableData]);
      } else {
        throw new Error("ERR_MALFORMED_DATA");
      }
    } catch (err: any) {
      const message = buildRequestErrorMessage(err, "creating to-do");
      if (message) {
        setError(message);
      }
    } finally {
      setLoading(false);
      setCreateMode(false);
    }
  };

  return (
    <div className="todo-dashboard">
      {error && <p className="status-message status-message--error">{error}</p>}
      {loading && <p className="status-message status-message--loading"></p>}
      <div className="todo-dashboard__container">
        <TodoDashboardControls
          onSearchChange={setSearchQuery}
          onFilterChange={setFilterType}
          onCreate={setCreateMode}
        />
        <TodoTable
          data={tableData}
          onEdit={setEditMode}
          onDelete={deleteTodo}
        />
      </div>
      {isEditing && editingTodo && (
        <EditTodoModal todo={editingTodo} onSave={editTodo} onClose={setEditMode} />
      )}
      {isCreating && <CreateTodoModal onCreate={createTodo} onClose={setCreateMode} />}
    </div>
  );
};
