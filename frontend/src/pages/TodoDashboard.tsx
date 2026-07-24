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

const buildRequestErrorMessage = (err: any, action: string) => {
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
        if (axios.isCancel(err)) {
          return;
        }

        setError(buildRequestErrorMessage(err, "fetching to-do table"));
      } finally {
        setLoading(false);
      }
    };

    fetchTableData();

    return () => abortController.abort();
  }, [searchQuery, filterType]);

  const setEditMode = (editMode: boolean, id: string | null) => {
    setIsEditing(editMode);
    setEditingTodoId(id);

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
      if (updatedTodo.name.trim() === "") {
        const editingTodo = tableData.find((todo) => todo.id === editingTodoId);
        if (editingTodo != null) {
          updatedTodo.name = editingTodo.name;
        }
      }

      const response = await api.put(`/api/todo-list/${editingTodoId}`, updatedTodo);
      if (response.data != null) {
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
      await api.delete(`/api/todo-list/${id}`);
      setTableData(tableData.filter((todo) => todo.id !== id));
    } catch (err: any) {
      setError(buildRequestErrorMessage(err, "deleting to-do"));
    } finally {
      setLoading(false);
    }
  };

  const setCreateMode = (createMode: boolean) => {
    setIsCreating(createMode);
  };

  const createTodo = async (newTodo: CreateTodoDTO) => {
    try {
      if (newTodo.name.trim() === "") {
        throw new Error("ERR_INVALID_PARAM");
      }

      const response = await api.post(`/api/todo-list`, newTodo);
      if (response.data != null) {
        setTableData([...tableData, response.data]);
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
        <TodoTable data={tableData} onEdit={setEditMode} onDelete={deleteTodo} />
      </div>
      {isEditing && editingTodo && (
        <EditTodoModal todo={editingTodo} onSave={editTodo} onClose={setEditMode} />
      )}
      {isCreating && <CreateTodoModal onCreate={createTodo} onClose={setCreateMode} />}
    </div>
  );
};
