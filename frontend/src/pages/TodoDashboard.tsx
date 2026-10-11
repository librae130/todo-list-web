import { useEffect, useState } from "react";
import type { TodoFilterOption } from "../types/TodoFilterOption.tsx";
import { TodoTable } from "../components/todo-table/TodoTable.tsx";
import { TodoDashboardControls } from "../components/todo-dashboard-controls/TodoDashboardControls.tsx";
import { NavigationBar } from "../components/NavigationBar.tsx";
import { useUser } from "../hooks/useUser.tsx";
import { useTodos } from "../hooks/useTodos.tsx";
import { useTodoBatchOperations } from "../hooks/useTodoBatchOperations.tsx";
import { useSaveTodoBatchOperations } from "../hooks/useSaveTodoBatchOperations.tsx";
import { useNavigate } from "react-router-dom";
import type { TodoDto } from "../dtos/TodoDto.tsx";
import type { TodoBatchAction } from "../types/TodoBatchAction.tsx";
import { TODO_DASHBOARD_TOAST_TIMEOUT } from "../constants/delay.tsx";

export const TodoDashboard = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<TodoFilterOption>("all");

  const {
    user,
    isLoading: isUserLoading,
    error: authError,
    logout,
  } = useUser();

  const {
    todos,
    refresh: refreshTodos,
    isLoading: isTodosLoading,
    error: todosError,
  } = useTodos({ user, searchQuery, filterType });

  const {
    batchOperations,
    hasPendingOperations,
    addOperation,
    updateOperation,
    removeOperation,
    clearOperations,
  } = useTodoBatchOperations();

  const {
    save,
    isSaving,
    error: saveError,
  } = useSaveTodoBatchOperations({
    todos,
    batchOperations,
    onBatchOperationSaved: removeOperation,
    onTodosChanged: refreshTodos,
  });

  const handleBatchOperationAdd = (
    todo: TodoDto | null,
    action: TodoBatchAction,
  ) => {
    if (user == null) {
      return;
    }

    try {
      addOperation(todo, action);
    } catch (error) {
      if (!(error instanceof RangeError)) {
        throw error;
      }
    }
  };

  const isLoading = isUserLoading || isTodosLoading || isSaving;
  const error = saveError || todosError || authError;
  const [visibleError, setVisibleError] = useState("");

  useEffect(() => {
    clearOperations();
  }, [user?.id, clearOperations]);

  useEffect(() => {
    if (!error) {
      setVisibleError("");
      return;
    }

    setVisibleError(error);
    const timeoutId = window.setTimeout(
      () => setVisibleError(""),
      TODO_DASHBOARD_TOAST_TIMEOUT,
    );
    return () => window.clearTimeout(timeoutId);
  }, [error]);

  return (
    <div className="todo-dashboard">
      <NavigationBar
        user={user}
        onLogin={() => navigate("/login")}
        onLogout={logout}
      />
      {visibleError && (
        <div className="todo-dashboard__error-toast" role="alert">
          <p>{visibleError}</p>
          <button
            type="button"
            aria-label="Dismiss error"
            onClick={() => setVisibleError("")}
          >
            Close
          </button>
        </div>
      )}

      <div className="todo-dashboard__container">
        <TodoDashboardControls
          isEditing={hasPendingOperations}
          isLoading={isLoading}
          onSave={save}
          onCancel={clearOperations}
          onSearch={setSearchQuery}
          onFilter={setFilterType}
          onCreate={() => handleBatchOperationAdd(null, "add")}
        />
        <div className="todo-table__container">
          <TodoTable
            isLoading={isLoading}
            todos={todos}
            batchOperations={batchOperations}
            onBatchOperationAdd={handleBatchOperationAdd}
            onBatchOperationUpdate={updateOperation}
            onBatchOperationCancel={removeOperation}
          />

          {todos.length <= 0 &&
            batchOperations.length <= 0 &&
            user != null &&
            !isLoading && (
              <span className="status-message status-message--info">
                No to-do items found. Start by creating a new one!
              </span>
            )}
          {user == null && (
            <span className="status-message status-message--info">
              Please log in to manage your to-do list.
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
