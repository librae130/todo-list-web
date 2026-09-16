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

export const TodoDashboard = () => {
  const navigate = useNavigate();

  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [tableData, setTableData] = useState<TodoDto[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<TodoFilterOption>("all");
  //const [isEditing, setIsEditing] = useState(false);
  //const [editingTodoId, setEditingTodoId] = useState<string | null>(null);
  //const [editingTodo, setEditingTodo] = useState<TodoDto | null>(null);
  const [showCreateRow, setShowCreateRow] = useState(false);
  const createRowRef = useRef<HTMLTableRowElement | null>(null);
  const [user, setUser] = useState<UserDto | null>(null);

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

        const todos = await TodoService.search(searchTodoDto, abortController.signal);

        const todosData =
          todos.map((todo) => ({
            ...todo,
            createdAt: formatDateTime(todo.createdAt),
          })) ?? [];
        setError("");
        setTableData(todosData);
      } catch (error: any) {
        setError(getErrorMessage(error));
      } finally {
        setLoading(false);
      }
    };

    fetchTableData();

    return () => abortController.abort();
  }, [user, searchQuery, filterType]);

  // // Manages the state for the editing modal.
  // const setEditMode = (editMode: boolean, id: string | null) => {
  //   setIsEditing(editMode);
  //   setEditingTodoId(id);

  //   // When entering edit mode, find the corresponding to-do from the table data
  //   // to populate the modal. When exiting, clear the editing state.
  //   if (editMode && id != null) {
  //     setEditingTodo(tableData.find((todo) => todo.id === id) ?? null);
  //   } else {
  //     setEditingTodo(null);
  //   }
  // };

  const editTodoAsync = async (editingTodoId: string, updatedTodo: UpdateTodoDto) => {
    if (editingTodoId == null) {
      return;
    }

    try {
      const updatedTodoResponse = await TodoService.update(editingTodoId, updatedTodo);
      if (updatedTodoResponse != null) {
        // After a successful API call, update the specific item in the local tableData state.
        setTableData(
          tableData.map((todo) => {
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
      setTableData(tableData.filter((todo) => todo.id !== id));
      await TodoService.remove(id);
    } catch (error: any) {
      setError(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  // Manages the state for the creating modal.
  // const setCreateMode = (createMode: boolean) => {
  //   setIsCreating(createMode);
  // };

  const addTodoAsync = async (newTodo: AddTodoDto) => {
    try {
      const createdTodo = await TodoService.create(newTodo);
      if (createdTodo != null) {
        setTableData([
          { ...createdTodo, createdAt: formatDateTime(createdTodo.createdAt) },
          ...tableData,
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

  return (
    <div className="todo-dashboard">
      {error && <p className="status-message status-message--error">{error}</p>}
      {loading && <p className="status-message status-message--loading"></p>}
      <div className="todo-dashboard__container">
        <TodoDashboardControls
          onSearchChange={setSearchQuery}
          onFilterChange={setFilterType}
          onClickCreate={handleCreateClick}
          onClickLogin={() => navigate("/login")}
        />

        <TodoTable
          data={tableData}
          showCreateRow={showCreateRow}
          onCloseCreateRow={() => setShowCreateRow(false)}
          onClickCreateAsync={addTodoAsync}
          onClickEditAsync={editTodoAsync}
          onClickRemoveAsync={removeTodoAsync}
          createRowRef={createRowRef}
        />
      </div>
      {tableData.length > 0 || showCreateRow || user == null || (
        <span className="status-message status-message--info">
          No to-do items found. Start by creating a new one!
        </span>
      )}
      {user == null && (
        <p className="status-message status-message--info">
          Please log in to manage your to-do list.
        </p>
      )}
      {/* {isEditing && editingTodo && (
        <EditTodoModal
          todo={editingTodo}
          onSave={editTodo}
          onClose={setEditMode}
        />
      )} */}

      {/* {isCreating && (
        <CreateTodoModal onCreate={createTodo} onClose={setCreateMode} />
      )} */}
    </div>
  );
};
