import { useEffect, useState } from "react";
import axios from "axios";
import { TodoService } from "../services/TodoService.tsx";
import type { TodoDto } from "../dtos/TodoDto.tsx";
import type { UserDto } from "../dtos/UserDto.tsx";
import type { SearchTodoDto } from "../dtos/SearchTodoDto.tsx";
import type { TodoFilter } from "../types/TodoFilter.tsx";
import { formatDateTime } from "../utils/stringUtils.tsx";
import { getErrorMessage } from "../utils/errorUtils.tsx";
import { compareTodo } from "../utils/todoUtils.tsx";

const buildSearchDto = (
  query: string,
  filterType: TodoFilter,
): SearchTodoDto => {
  const dto: SearchTodoDto = { name: "", description: "", createdAt: "" };

  switch (filterType) {
    case "all":
      dto.name = query;
      dto.description = query;
      break;
    case "name":
      dto.name = query;
      break;
    case "description":
      dto.description = query;
      break;
    case "createdDate":
      dto.createdAt = query;
      break;
  }

  return dto;
};

interface UseTodosOptions {
  user: UserDto | null;
  searchQuery: string;
  filterType: TodoFilter;
}

export const useTodos = ({
  user,
  searchQuery,
  filterType,
}: UseTodosOptions) => {
  const [todos, setTodos] = useState<TodoDto[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (user == null) {
      setTodos([]);
      setError("");
      return;
    }

    const abortController = new AbortController();

    const fetchTodos = async () => {
      setIsLoading(true);

      try {
        const searchedTodos = await TodoService.search(
          buildSearchDto(searchQuery, filterType),
          abortController.signal,
        );

        const formattedTodos = searchedTodos.map((todo) => ({
          ...todo,
          createdAt: formatDateTime(todo.createdAt),
        }));

        setError("");
        setTodos(formattedTodos.toSorted(compareTodo));
      } catch (error: unknown) {
        if (axios.isCancel(error)) return;

        setError(getErrorMessage(error));
      } finally {
        if (!abortController.signal.aborted) setIsLoading(false);
      }
    };

    fetchTodos();

    return () => abortController.abort();
  }, [user, searchQuery, filterType]);

  return { todos, setTodos, isLoading, error };
};
