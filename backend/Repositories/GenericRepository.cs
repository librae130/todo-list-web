using System.Linq.Expressions;
using Microsoft.EntityFrameworkCore;

namespace backend.Repositories;

public class GenericRepository<T, TContext> : IGenericRepository<T>
    where T : class
    where TContext : DbContext
{
    protected readonly TContext _context;
    protected readonly DbSet<T> _dbSet;

    public GenericRepository(TContext context)
    {
        _context = context;
        _dbSet = context.Set<T>();
    }

    public async Task<T?> GetByIdAsync(Guid id, CancellationToken ct = default)
    {
        T? todo = await _dbSet.FindAsync(id, ct);
        return todo;
    }

    public async Task<List<T>> GetAllAsync(CancellationToken ct = default)
    {
        List<T> todos = await _dbSet.ToListAsync(ct);
        return todos;
    }

    public async Task<List<T>> FindAsync(
        Expression<Func<T, bool>> predicate,
        CancellationToken ct = default
    )
    {
        List<T> foundTodos = await _dbSet.Where(predicate).ToListAsync(ct);
        return foundTodos;
    }

    public async Task<T?> FirstOrDefaultAsync(
        Expression<Func<T, bool>> predicate,
        CancellationToken ct = default
    )
    {
        T? foundTodo = await _dbSet.FirstOrDefaultAsync(predicate, ct);
        return foundTodo;
    }

    public async Task AddAsync(T entity, CancellationToken ct = default)
    {
        await _dbSet.AddAsync(entity, ct);
    }

    public async void Update(T entity)
    {
        _dbSet.Update(entity);
    }

    public async void Remove(T entity)
    {
        _dbSet.Remove(entity);
    }

    public async Task<int> SaveAsync(CancellationToken ct = default)
    {
        return await _context.SaveChangesAsync(ct);
    }
}
