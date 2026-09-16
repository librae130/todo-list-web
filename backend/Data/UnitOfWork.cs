using backend.Entities;
using backend.Repositories;
using Microsoft.EntityFrameworkCore;

namespace backend.Data;

public class UnitOfWork<TContext> : IUnitOfWork
    where TContext : DbContext
{
    private readonly TContext _context;
    private Dictionary<Type, object> _repoCache { get; set; }
    private static readonly Dictionary<Type, Func<TContext, object>> _customRepoBuilder = new()
    {
        { typeof(Todo), context => new TodoRepository<TContext>(context) },
    };

    public UnitOfWork(TContext context)
    {
        _context = context;
        _repoCache = new();
    }

    public IGenericRepository<T> GetRepository<T>()
        where T : class
    {
        Type type = typeof(T);

        if (_repoCache.TryGetValue(type, out object? repo))
        {
            return (IGenericRepository<T>)repo;
        }

        if (_customRepoBuilder.TryGetValue(type, out Func<TContext, object>? builder))
        {
            object newCustomRepo = builder(_context);
            _repoCache[type] = newCustomRepo;
            return (IGenericRepository<T>)newCustomRepo;
        }

        GenericRepository<T, TContext> newRepo = new GenericRepository<T, TContext>(_context);
        _repoCache[type] = newRepo;
        return newRepo;
    }

    public async Task<int> SaveAsync(CancellationToken ct = default)
    {
        return await _context.SaveChangesAsync();
    }

    public void Dispose()
    {
        _context.Dispose();
    }
}
