using System.Linq.Expressions;

namespace backend.Repositories;

public interface IGenericRepository<T>
    where T : class
{
    Task<T?> GetByIdAsync(Guid id, CancellationToken ct = default);
    Task<List<T>> GetAllAsync(CancellationToken ct = default);
    Task<List<T>> FindAsync(Expression<Func<T, bool>> predicate, CancellationToken ct = default);
    Task<T?> FirstOrDefaultAsync(
        Expression<Func<T, bool>> predicate,
        CancellationToken ct = default
    );
    Task AddAsync(T entity, CancellationToken ct = default);
    void Update(T entity);
    void Remove(T entity);
    Task<int> SaveAsync(CancellationToken ct = default);
}
