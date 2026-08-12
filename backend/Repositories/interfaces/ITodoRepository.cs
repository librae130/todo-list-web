using backend.Dtos;
using backend.Entities;

namespace backend.Repositories;

public interface ITodoRepository : IGenericRepository<Todo>
{
    Task<List<Todo>> SearchTodosAsync(Guid userId, SearchTodoDto searchTodo, CancellationToken ct = default);
}
