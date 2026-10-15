using backend.Entities;
using backend.Repositories;
using Microsoft.EntityFrameworkCore;

namespace backend.Data;

public class UnitOfWork<TContext> : IUnitOfWork
    where TContext : DbContext
{
    private readonly TContext _context;
    private Dictionary<Type, object> _repoCache { get; set; }

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
