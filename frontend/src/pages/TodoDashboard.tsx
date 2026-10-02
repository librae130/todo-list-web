import { useState } from "react";
import type { TodoFilter } from "../types/TodoFilter.tsx";
import { TodoTable } from "../components/todo-table/TodoTable.tsx";
import { TodoDashboardControls } from "../components/todo-dashboard-controls/TodoDashboardControls.tsx";
import { NavigationBar } from "../components/NavigationBar.tsx";
import { useUser } from "../hooks/useUser.tsx";
import { useTodos } from "../hooks/useTodos.tsx";
import { useTodoDrafts } from "../hooks/useTodoDrafts.tsx";
import { useSaveTodoDrafts } from "../hooks/useSaveTodoDrafts.tsx";
import { useNavigate } from "react-router-dom";

export const TodoDashboard = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<TodoFilter>("all");

  const {
    user,
    isLoading: isUserLoading,
    error: authError,
    logout,
  } = useUser();

  const {
    todos,
    setTodos,
    isLoading: isTodosLoading,
    error: todosError,
  } = useTodos(user, searchQuery, filterType);

  const {
    todoDrafts,
    isEditing,
    addDraft,
    updateDraft,
    removeDraft,
    resetDrafts,
  } = useTodoDrafts();

  const {
    save,
    isSaving,
    error: saveError,
  } = useSaveTodoDrafts({ todos, setTodos, todoDrafts, onSaved: resetDrafts });

  const isLoading = isUserLoading || isTodosLoading || isSaving;
  const error = saveError || todosError || authError;

  return (
    <div className="todo-dashboard">
      <NavigationBar
        user={user}
        onLogin={() => navigate("/login")}
        onLogout={logout}
      />
      {error && <p className="status-message status-message--error">{error}</p>}

      <div className="todo-dashboard__container">
        <TodoDashboardControls
          isEditing={isEditing}
          onSave={save}
          onCancel={resetDrafts}
          onSearch={setSearchQuery}
          onFilter={setFilterType}
          onCreate={() => addDraft(null, "add")}
        />
        <div className="todo-table__container">
          <TodoTable
            todos={todos}
            todoDrafts={todoDrafts}
            onDraftAdd={addDraft}
            onDraftUpdate={updateDraft}
            onDraftCancel={removeDraft}
          />
        </div>
      </div>

      {todos.length <= 0 &&
        todoDrafts.length <= 0 &&
        user != null &&
        !isLoading && (
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
