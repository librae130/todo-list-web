using backend.Data;
using backend.Dtos;
using backend.Entities;
using Microsoft.EntityFrameworkCore;

namespace backend.Repositories;

public class TodoRepository<TContext> : GenericRepository<Todo, TContext>, ITodoRepository
    where TContext : DbContext
{
    public TodoRepository(TContext context)
        : base(context) { }

    public async Task<List<Todo>> SearchTodosAsync(
        Guid userId,
        SearchTodoDto searchTodoDto,
        CancellationToken cancellationToken
    )
    {
        var query = _dbSet.AsQueryable();

        query = query.Where(x => x.UserId == userId);

        if (!string.IsNullOrWhiteSpace(searchTodoDto.Name))
        {
            query = query.Where(x =>
                x.Name.Trim().ToLowerInvariant() == searchTodoDto.Name.Trim().ToLowerInvariant()
            );
        }

        if (!string.IsNullOrWhiteSpace(searchTodoDto.Description))
        {
            query = query.Where(x =>
                x.Description.Trim().ToLowerInvariant()
                == searchTodoDto.Description.Trim().ToLowerInvariant()
            );
        }

        if (searchTodoDto.CreatedAt != null)
        {
            if (DateTime.TryParse(searchTodoDto.CreatedAt, out var date))
            {
                query = query.Where(x => x.CreatedAt.Date == date);
            }
        }

        return await query.ToListAsync(cancellationToken);
    }
}
