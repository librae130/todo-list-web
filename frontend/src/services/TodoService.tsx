import { apiClient } from "../utils/apiClient";
import type { AddTodoDto } from "../dtos/AddTodoDto";
import type { TodoDto } from "../dtos/TodoDto";
import type { SearchTodoDto } from "../dtos/SearchTodoDto";
import type { UpdateTodoDto } from "../dtos/UpdateTodoDto";

export class TodoService {
  public static async search(
    searchTodoDto: SearchTodoDto,
    signal?: AbortSignal,
  ): Promise<TodoDto[]> {
    const response = await apiClient.post<TodoDto[]>("/api/todos/search", searchTodoDto, {
      signal,
    });
    return response.data;
  }

  public static async create(todo: AddTodoDto): Promise<TodoDto> {
    const response = await apiClient.post<TodoDto>("/api/todos", todo);
    return response.data;
  }

  public static async update(id: string, todo: UpdateTodoDto): Promise<TodoDto> {
    const response = await apiClient.put<TodoDto>(`/api/todos/${id}`, todo);
    return response.data;
  }

  public static async remove(id: string): Promise<void> {
    await apiClient.delete(`/api/todos/${id}`);
  }
}
