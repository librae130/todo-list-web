import { useState, useEffect, useRef } from "react";
import { apiClient } from "../utils/api.tsx";
import type { TodoDTO } from "../dtos/TodoDTO.tsx";
import type { UpdateTodoDTO } from "../dtos/UpdateTodoDTO.tsx";
import type { CreateTodoDTO } from "../dtos/CreateTodoDTO.tsx";
import type { TodoFilterOption } from "../components/todo-dashboard-controls/TodoFilterSelect.tsx";
import { TodoTable } from "../components/TodoTable.tsx";
import { TodoDashboardControls } from "../components/todo-dashboard-controls/TodoDashboardControls.tsx";
//import { EditTodoModal } from "../components/EditTodoModal.tsx";
//import { CreateTodoModal } from "../components/CreateTodoModal.tsx";
import { formatDateTime } from "../utils/stringUtils.tsx";
import { getErrorMessage } from "../utils/errorUtils.tsx";
import { useNavigate } from "react-router-dom";

export const TodoDashboard = () => {
  const navigate = useNavigate();

  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [tableData, setTableData] = useState<TodoDTO[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<TodoFilterOption>("all");
  //const [isEditing, setIsEditing] = useState(false);
  //const [editingTodoId, setEditingTodoId] = useState<string | null>(null);
  //const [editingTodo, setEditingTodo] = useState<TodoDTO | null>(null);
  const [showCreateRow, setShowCreateRow] = useState(false);
  const createRowRef = useRef<HTMLTableRowElement | null>(null);

  // This effect hook is responsible for fetching the to-do list data whenever the search query or filter type changes.
  useEffect(() => {
    const abortController = new AbortController();

    const fetchTableData = async () => {
      setLoading(true);
      try {
        const response = await apiClient.get("/api/todo-list/search", {
          signal: abortController.signal,
          params: {
            search: searchQuery ?? "",
            filter: filterType,
          },
        });

        const todosData =
          response.data.map((todo: any) => ({
            ...todo,
            createdAt: formatDateTime(todo.createdAt),
          })) ?? [];
        setError("");
        setTableData(todosData);
      } catch (err: any) {
        setError(getErrorMessage(err));
      } finally {
        setLoading(false);
      }
    };

    fetchTableData();

    return () => abortController.abort();
  }, [searchQuery, filterType]);

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

  const editTodoAsync = async (editingTodoId: string, updatedTodo: UpdateTodoDTO) => {
    if (editingTodoId == null) {
      return;
    }

    try {
      const response = await apiClient.put(`/api/todo-list/${editingTodoId}`, updatedTodo);
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
        throw new Error("Malformed data.");
      }
    } catch (err: any) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
      //setEditMode(false, null);
    }
  };

  const deleteTodoAsync = async (id: string) => {
    setLoading(true);
    try {
      setTableData(tableData.filter((todo) => todo.id !== id));
      await apiClient.delete(`/api/todo-list/${id}`);
    } catch (err: any) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  // Manages the state for the creating modal.
  // const setCreateMode = (createMode: boolean) => {
  //   setIsCreating(createMode);
  // };

  const createTodoAsync = async (newTodo: CreateTodoDTO) => {
    try {
      const response = await apiClient.post(`/api/todo-list`, newTodo);
      if (response.data != null) {
        setTableData([
          { ...response.data, createdAt: formatDateTime(response.data.createdAt) },
          ...tableData,
        ]);
      } else {
        throw new Error("Malformed data.");
      }
    } catch (err: any) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const handleCreateClick = () => {
    setShowCreateRow(true);

    requestAnimationFrame(() => {
      createRowRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "center",
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
          onClickCreateAsync={createTodoAsync}
          onClickEditAsync={editTodoAsync}
          onClickDeleteAsync={deleteTodoAsync}
          createRowRef={createRowRef}
        />
      </div>
      {tableData.length > 0 || showCreateRow || (
        <span className="status-message status-message--info">
          No to-do items found. Start by creating a new one!
        </span>
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
