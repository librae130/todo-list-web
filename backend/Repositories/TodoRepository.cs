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
        IQueryable<Todo> query = _dbSet.AsQueryable();

        query = query.Where(x => x.UserId == userId);

        bool hasName = !string.IsNullOrWhiteSpace(searchTodoDto.Name);
        string nameSearch = hasName ? searchTodoDto.Name.Trim().ToLower() : "";

        bool hasDescription = !string.IsNullOrWhiteSpace(searchTodoDto.Description);
        string descriptionSearch = hasDescription ? searchTodoDto.Description.Trim().ToLower() : "";

        bool hasDate = DateTime.TryParse(searchTodoDto.CreatedAt, out DateTime parsedDate);
        DateTime startDate = hasDate ? parsedDate.Date : default;
        DateTime endDate = hasDate ? parsedDate.Date.AddDays(1) : default;

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
