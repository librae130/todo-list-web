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
import type { TodoDraft } from "../types/TodoDraft.tsx";
export const TodoDashboard = () => {
  const navigate = useNavigate();

  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);

  const [todos, setTodos] = useState<TodoDto[]>([]);
  const [todoDrafts, setTodoDrafts] = useState<TodoDraft[]>([]);
  const [user, setUser] = useState<UserDto | null>(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<TodoFilterOption>("all");

  const [showCreateRow, setShowCreateRow] = useState(false);
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

    const fetchTableData = async () => {
      setLoading(true);
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
        setTodos(formattedTodos);
      } catch (error: any) {
        setError(getErrorMessage(error));
      } finally {
        setLoading(false);
      }
    };

    fetchTableData();

    return () => abortController.abort();
  }, [user, searchQuery, filterType]);

  const editTodoAsync = async (
    editingTodoId: string,
    updatedTodo: UpdateTodoDto,
  ) => {
    if (editingTodoId == null) {
      return;
    }

    try {
      const updatedTodoResponse = await TodoService.update(
        editingTodoId,
        updatedTodo,
      );
      if (updatedTodoResponse != null) {
        // After a successful API call, update the specific item in the local tableData state.
        setTodos(
          todos.map((todo) => {
            if (todo.id === editingTodoId) {
              return {
                ...todo,
                name: updatedTodoResponse.name,
                description: updatedTodoResponse.description,
              };
            }
            return todo;
          }),
        );
      } else {
        throw new Error("Malformed data.");
      }
    } catch (error: any) {
      setError(getErrorMessage(error));
    } finally {
      setLoading(false);
      //setEditMode(false, null);
    }
  };

  const removeTodoAsync = async (id: string) => {
    setLoading(true);
    try {
      setTodos(todos.filter((todo) => todo.id !== id));
      await TodoService.remove(id);
    } catch (error: any) {
      setError(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  const addTodoAsync = async (newTodo: AddTodoDto) => {
    try {
      const createdTodo = await TodoService.create(newTodo);
      if (createdTodo != null) {
        setTodos([
          { ...createdTodo, createdAt: formatDateTime(createdTodo.createdAt) },
          ...todos,
        ]);
      } else {
        throw new Error("Malformed data.");
      }
    } catch (error: any) {
      setError(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  const handleCreateClick = () => {
    setShowCreateRow(true);

    requestAnimationFrame(() => {
      createRowRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "end",
      });
    });
  };

  const handleLogoutClick = async () => {
    try {
      await AuthService.logout();
      setUser(null);
      setTodos([]);
      setError("");
    } catch (error) {
      setError(getErrorMessage(error));
    }
  };

  return (
    <div className="todo-dashboard">
      <NavigationBar
        user={user}
        onLogin={() => navigate("/login")}
        onLogout={handleLogoutClick}
      />
      {error && <p className="status-message status-message--error">{error}</p>}
      {loading && <p className="status-message status-message--loading"></p>}
      <div className="todo-dashboard__container">
        <TodoDashboardControls
          onSearchChange={setSearchQuery}
          onFilterChange={setFilterType}
          onCreate={handleCreateClick}
        />
        <TodoTable
          todos={todos}
          showCreateRow={showCreateRow}
          onCloseCreateRow={() => setShowCreateRow(false)}
          onCreateAsync={addTodoAsync}
          onEditAsync={editTodoAsync}
          onRemoveAsync={removeTodoAsync}
          createRowRef={createRowRef}
        />
      </div>
      {todos.length > 0 || showCreateRow || user == null || (
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
