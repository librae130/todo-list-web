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

        var hasName = !string.IsNullOrWhiteSpace(searchTodoDto.Name);
        var nameSearch = hasName ? searchTodoDto.Name.Trim().ToLower() : "";

        var hasDescription = !string.IsNullOrWhiteSpace(searchTodoDto.Description);
        var descriptionSearch = hasDescription ? searchTodoDto.Description.Trim().ToLower() : "";

        var hasDate = DateTime.TryParse(searchTodoDto.CreatedAt, out var parsedDate);
        var startDate = hasDate ? parsedDate.Date : default;
        var endDate = hasDate ? parsedDate.Date.AddDays(1) : default;

        if (hasName || hasDescription || hasDate)
        {
            query = query.Where(x =>
                (hasName && x.Name.ToLower().Contains(nameSearch))
                || (hasDescription && x.Description.ToLower().Contains(descriptionSearch))
                || (hasDate && x.CreatedAt >= startDate && x.CreatedAt < endDate)
            );
        }

        return await query.OrderByDescending(x => x.CreatedAt).ToListAsync(cancellationToken);
    }
}
