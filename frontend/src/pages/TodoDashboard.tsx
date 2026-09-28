import { useState, useEffect, useRef } from "react";
import { TodoService } from "../services/TodoService.tsx";
import { UserService } from "../services/UserService.tsx";
import type { TodoDto } from "../dtos/TodoDto.tsx";
import type { UpdateTodoDto } from "../dtos/UpdateTodoDto.tsx";
import type { AddTodoDto } from "../dtos/AddTodoDto.tsx";
import type { UserDto } from "../dtos/UserDto.tsx";
import type { TodoFilterOption } from "../components/todo-dashboard-controls/TodoFilterSelect.tsx";
import { TodoTable } from "../components/todo-table/TodoTable.tsx";
import { TodoDashboardControls } from "../components/todo-dashboard-controls/TodoDashboardControls.tsx";
//import { EditTodoModal } from "../components/EditTodoModal.tsx";
//import { CreateTodoModal } from "../components/CreateTodoModal.tsx";
import { formatDateTime } from "../utils/stringUtils.tsx";
import { getErrorMessage } from "../utils/errorUtils.tsx";
import { useNavigate } from "react-router-dom";
import type { SearchTodoDto } from "../dtos/SearchTodoDto.tsx";
import axios from "axios";
import { AuthService } from "../services/AuthService.tsx";
import { NavigationBar } from "../components/NavigationBar.tsx";
import type { TodoDraft, TodoDraftChanges } from "../types/TodoDraft.tsx";
export const TodoDashboard = () => {
  const navigate = useNavigate();

  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);

  const [todos, setTodos] = useState<TodoDto[]>([]);
  const [todoDrafts, setTodoDrafts] = useState<TodoDraft[]>([]);
  const [user, setUser] = useState<UserDto | null>(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<TodoFilterOption>("all");

  const createRowRef = useRef<HTMLTableRowElement | null>(null);

  // This hook is for fetching current user if logged in.
  useEffect(() => {
    const controller = new AbortController();

    const fetchUser = async () => {
      try {
        const currentUser = await UserService.getCurrentUser(controller.signal);
        setUser(currentUser);
      } catch (error) {
        if (axios.isCancel(error)) return;

        setUser(null);
      }
    };

    fetchUser();

    return () => controller.abort();
  }, []);

  // This effect hook is responsible for fetching the to-do list data whenever the search query or filter type changes.
  useEffect(() => {
    if (user == null) return;

    const abortController = new AbortController();

    const fetchTodosFiltered = async () => {
      setIsLoading(true);
      try {
        const searchTodoDto: SearchTodoDto = {
          name: "",
          description: "",
          createdAt: "",
        };

        if (filterType === "all") {
          searchTodoDto.name = searchQuery;
          searchTodoDto.description = searchQuery;
        } else if (filterType === "name") {
          searchTodoDto.name = searchQuery;
        } else if (filterType === "description") {
          searchTodoDto.description = searchQuery;
        } else if (filterType === "createdDate") {
          searchTodoDto.createdAt = searchQuery;
        }

        const searchedTodos = await TodoService.search(
          searchTodoDto,
          abortController.signal,
        );
        const formattedTodos =
          searchedTodos.map((todo) => ({
            ...todo,
            createdAt: formatDateTime(todo.createdAt),
          })) ?? [];
        setError("");

        setTodos(
          formattedTodos.sort((left, right) =>
            left.name.localeCompare(right.name),
          ),
        );
      } catch (error: any) {
        setError(getErrorMessage(error));
      } finally {
        setIsLoading(false);
      }
    };

    fetchTodosFiltered();

    return () => abortController.abort();
  }, [user, searchQuery, filterType]);

  const handleLogoutUser = async () => {
    try {
      await AuthService.logout();
      setUser(null);
      setTodos([]);
      setError("");
    } catch (error) {
      setError(getErrorMessage(error));
    }
  };

  const handleAddTodoDraft = (
    todo: TodoDto | null,
    action: TodoDraft["action"],
  ) => {
    setTodoDrafts((drafts) => [
      ...drafts,
      {
        ...todo,
        clientId: crypto.randomUUID(),
        action,
        name: todo?.name ?? "",
        description: todo?.description ?? "",
      },
    ]);

    setIsEditing(true);
  };

  const handleUpdateTodoDraft = (
    clientId: string,
    changes: TodoDraftChanges,
  ) => {
    setTodoDrafts((drafts) =>
      drafts.map((draft) =>
        draft.clientId === clientId ? { ...draft, ...changes } : draft,
      ),
    );
  };

  const handleRemoveTodoDraft = (clientId: string) => {
    setTodoDrafts((drafts) =>
      drafts.filter((draft) => draft.clientId !== clientId),
    );
  };

  const saveAddedTodo = async (draft: TodoDraft) => {
    const newTodo: AddTodoDto = {
      name: draft.name ?? "",
      description: draft.description ?? "",
    };
    const createdTodo = await TodoService.create(newTodo);
    setTodos((currentTodos) => [
      { ...createdTodo, createdAt: formatDateTime(createdTodo.createdAt) },
      ...currentTodos,
    ]);
  };

  const saveUpdatedTodo = async (draft: TodoDraft) => {
    if (!draft.id)
      throw new Error("Unable to update a to-do item without an ID.");

    const updatedTodo: UpdateTodoDto = {
      name: draft.name ?? "",
      description: draft.description ?? "",
    };
    const updatedTodoResponse = await TodoService.update(draft.id, updatedTodo);
    setTodos((currentTodos) =>
      currentTodos.map((todo) =>
        todo.id === draft.id
          ? {
              ...todo,
              name: updatedTodoResponse.name,
              description: updatedTodoResponse.description,
            }
          : todo,
      ),
    );
  };

  const saveRemovedTodo = async (draft: TodoDraft) => {
    if (!draft.id)
      throw new Error("Unable to remove a to-do item without an ID.");

    await TodoService.remove(draft.id);
    setTodos((currentTodos) =>
      currentTodos.filter((todo) => todo.id !== draft.id),
    );
  };

  const handleSaveEdit = async () => {
    setIsLoading(true);
    setError("");

    try {
      for (const draft of todoDrafts) {
        switch (draft.action) {
          case "add":
            await saveAddedTodo(draft);
            break;
          case "update":
            await saveUpdatedTodo(draft);
            break;
          case "remove":
            await saveRemovedTodo(draft);
            break;
        }
      }

      setTodos((currentTodos) =>
        currentTodos.toSorted((left, right) =>
          left.name.localeCompare(right.name),
        ),
      );
      setTodoDrafts([]);
      setIsEditing(false);
    } catch (error: any) {
      setError(getErrorMessage(error));
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelEdit = () => {
    setTodoDrafts([]);
    setIsEditing(false);
  };

  return (
    <div className="todo-dashboard">
      <NavigationBar
        user={user}
        onLogin={() => navigate("/login")}
        onLogout={handleLogoutUser}
      />
      {error && <p className="status-message status-message--error">{error}</p>}
      {!isLoading &&
      <div className="todo-dashboard__container">
        <TodoDashboardControls
          isEditing={isEditing}
          onSave={handleSaveEdit}
          onCancel={handleCancelEdit}
          onSearch={setSearchQuery}
          onFilter={setFilterType}
          onCreate={() => handleAddTodoDraft(null, "add")}
        />
        <TodoTable
          todos={todos}
          todoDrafts={todoDrafts}
          onDraftAdd={handleAddTodoDraft}
          onDraftUpdate={handleUpdateTodoDraft}
          onDraftCancel={handleRemoveTodoDraft}
        />
      </div>}
      {todos.length > 0 || todoDrafts.length > 0 || user == null || isLoading || (
        <span className="status-message status-message--info">
          No to-do items found. Start by creating a new one!
        </span>
      )}
      {user == null && (
        <p className="status-message status-message--info">
          Please log in to manage your to-do list.
        </p>
      )}
    </div>
  );
};
